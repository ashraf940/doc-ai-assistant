import graphene
from accounts.graphql.auth import AuthMutations
from orgs.graphql import OrganizationsQuery, OrgsMutations
from documents.graphql import DocumentsQuery, DocumentsMutations
from ai.graphql import AIQuery, AIMutations

class Query(OrganizationsQuery, DocumentsQuery, AIQuery, graphene.ObjectType):
    pass

class Mutation(AuthMutations, OrgsMutations, DocumentsMutations, AIMutations, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)
