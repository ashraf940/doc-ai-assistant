import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.contrib.auth import get_user_model
from orgs.models import Organization, Membership, UserActiveOrganization
from app.permissions import require_auth, require_membership, require_role

User = get_user_model()

class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields = ("id", "name", "created_at")

class OrganizationsQuery(graphene.ObjectType):
    organizations = graphene.List(OrganizationType)

    def resolve_organizations(self, info):
        user = require_auth(info)
        return Organization.objects.filter(memberships__user=user).distinct()

class InviteUserToOrganization(graphene.Mutation):
    class Arguments:
        org_id = graphene.ID(required=True)
        email = graphene.String(required=True)
        role = graphene.String(required=True)  # ADMIN/MEMBER

    ok = graphene.Boolean()

    def mutate(self, info, org_id, email, role):
        user = require_auth(info)
        org = Organization.objects.get(id=org_id)
        require_role(user, org, "ADMIN")

        if role not in ["ADMIN", "MEMBER"]:
            raise GraphQLError("Invalid role.")

        invited_user, _ = User.objects.get_or_create(username=email, defaults={"email": email})
        Membership.objects.update_or_create(
            user=invited_user,
            organization=org,
            defaults={"role": role},
        )
        return InviteUserToOrganization(ok=True)

class SwitchActiveOrganization(graphene.Mutation):
    class Arguments:
        org_id = graphene.ID(required=True)

    ok = graphene.Boolean()
    active_org = graphene.Field(OrganizationType)

    def mutate(self, info, org_id):
        user = require_auth(info)
        org = Organization.objects.get(id=org_id)
        require_membership(user, org)
        UserActiveOrganization.objects.update_or_create(user=user, defaults={"organization": org})
        return SwitchActiveOrganization(ok=True, active_org=org)

class OrgsMutations(graphene.ObjectType):
    invite_user_to_organization = InviteUserToOrganization.Field()
    switch_active_organization = SwitchActiveOrganization.Field()
