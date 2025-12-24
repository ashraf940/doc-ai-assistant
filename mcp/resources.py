from documents.models import Document

def read_resource(uri: str) -> dict:
    if not uri.startswith("document://"):
        raise ValueError("Unsupported resource URI")

    doc_id = uri.replace("document://", "").strip()
    if not doc_id.isdigit():
        raise ValueError("Invalid document id")

    doc = Document.objects.select_related("organization").get(id=int(doc_id))

    return {
        "uri": uri,
        "type": "document",
        "data": {
            "id": doc.id,
            "title": doc.title,
            "content": doc.content,
            "organization_id": doc.organization_id,
        },
    }
