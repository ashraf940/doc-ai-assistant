from graphql import GraphQLError
from documents.models import Document
from ai.models import AIConversation
from mcp.client import MCPClient
from ai.llm_client import LLMClient

def ask_document_question(*, user, document_id: int, question: str) -> AIConversation:
    try:
        doc = Document.objects.get(id=document_id)
    except Document.DoesNotExist:
        raise GraphQLError("Document not found.")

    # 1) Fetch context via MCP
    mcp = MCPClient()
    ctx = mcp.read_resource(f"document://{doc.id}")

    # 2) LLM consumes MCP context (structured)
    llm = LLMClient()
    answer = llm.answer(question=question, mcp_context=ctx)

    # 3) Persist conversation
    return AIConversation.objects.create(
        document=doc,
        asked_by=user,
        question=question,
        answer=answer,
    )
