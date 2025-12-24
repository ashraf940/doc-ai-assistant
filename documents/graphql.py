import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from documents.models import Document
from app.permissions import require_auth, get_active_org, require_membership, require_role

class DocumentType(DjangoObjectType):
    class Meta:
        model = Document
        fields = ("id", "title", "content", "created_at")

class DocumentsQuery(graphene.ObjectType):
    documents = graphene.List(DocumentType)
    document = graphene.Field(DocumentType, id=graphene.ID(required=True))

    def resolve_documents(self, info):
        user = require_auth(info)
        org = get_active_org(info)
        require_membership(user, org)
        return Document.objects.filter(organization=org).order_by("-created_at")

    def resolve_document(self, info, id):
        user = require_auth(info)
        org = get_active_org(info)
        require_membership(user, org)

        try:
            doc = Document.objects.get(id=id)
        except Document.DoesNotExist:
            raise GraphQLError("Document not found.")

        if doc.organization_id != org.id:
            raise GraphQLError("Not authorized for this document.")
        return doc

class CreateDocument(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        content = graphene.String(required=True)

    document = graphene.Field(DocumentType)

    def mutate(self, info, title, content):
        user = require_auth(info)
        org = get_active_org(info)
        require_role(user, org, "ADMIN")

        doc = Document.objects.create(
            organization=org,
            title=title,
            content=content,
            created_by=user,
        )
        return CreateDocument(document=doc)

class DocumentsMutations(graphene.ObjectType):
    create_document = CreateDocument.Field()
