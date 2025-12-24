from graphql import GraphQLError
from orgs.models import Membership, UserActiveOrganization

def require_auth(info):
    user = info.context.user
    if not user or not user.is_authenticated:
        raise GraphQLError("Authentication required.")
    return user

def get_active_org(info):
    user = require_auth(info)
    try:
        return UserActiveOrganization.objects.select_related("organization").get(user=user).organization
    except UserActiveOrganization.DoesNotExist:
        raise GraphQLError("No active organization selected.")

def require_membership(user, org):
    try:
        return Membership.objects.get(user=user, organization=org)
    except Membership.DoesNotExist:
        raise GraphQLError("Not authorized for this organization.")

def require_role(user, org, role: str):
    m = require_membership(user, org)
    if m.role != role:
        raise GraphQLError("Not authorized (insufficient role).")
    return m
