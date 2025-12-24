import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from ai.models import AIConversation
from documents.models import Document
from app.permissions import require_auth, get_active_org, require_membership
from ai.qa_service import ask_document_question

class AIConversationType(DjangoObjectType):
    class Meta:
        model = AIConversation
        fields = ("id", "question", "answer", "created_at")

class AIQuery(graphene.ObjectType):
    ai_conversations = graphene.List(AIConversationType, document_id=graphene.ID(required=True))

    def resolve_ai_conversations(self, info, document_id):
        user = require_auth(info)
        org = get_active_org(info)
        require_membership(user, org)

        try:
            doc = Document.objects.get(id=document_id)
        except Document.DoesNotExist:
            raise GraphQLError("Document not found.")
        if doc.organization_id != org.id:
            raise GraphQLError("Not authorized for this document.")

        return AIConversation.objects.filter(document=doc).order_by("-created_at")

class AskDocumentAIQuestion(graphene.Mutation):
    class Arguments:
        document_id = graphene.ID(required=True)
        question = graphene.String(required=True)

    conversation = graphene.Field(AIConversationType)

    def mutate(self, info, document_id, question):
        user = require_auth(info)
        org = get_active_org(info)
        require_membership(user, org)

        try:
            doc = Document.objects.get(id=document_id)
        except Document.DoesNotExist:
            raise GraphQLError("Document not found.")
        if doc.organization_id != org.id:
            raise GraphQLError("Not authorized for this document.")

        conv = ask_document_question(user=user, document_id=doc.id, question=question)
        return AskDocumentAIQuestion(conversation=conv)

class AIMutations(graphene.ObjectType):
    ask_document_ai_question = AskDocumentAIQuestion.Field()
