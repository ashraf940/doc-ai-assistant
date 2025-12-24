from orgs.models import UserActiveOrganization

class ActiveOrgMiddleware:
    """
    GraphQL middleware:
    Attaches active organization to request context as `info.context.active_org`
    """

    def resolve(self, next, root, info, **kwargs):
        request = info.context
        request.active_org = None

        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            try:
                request.active_org = (
                    UserActiveOrganization.objects
                    .select_related("organization")
                    .get(user=user)
                    .organization
                )
            except UserActiveOrganization.DoesNotExist:
                request.active_org = None

        return next(root, info, **kwargs)
