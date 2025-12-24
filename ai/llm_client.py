import os
import json
from openai import OpenAI

class LLMClient:
    def __init__(self):
        if os.getenv("LLM_PROVIDER", "openai") != "openai":
            raise ValueError("Only openai wired. Extend if needed.")
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def answer(self, question: str, mcp_context: dict) -> str:
        # Context comes from MCP as STRUCTURED JSON (not resolver concatenation).
        ctx_json = json.dumps(mcp_context.get("data", {}), ensure_ascii=False)

        messages = [
            {"role": "system", "content": "You are a document assistant. Use context only."},
            {"role": "developer", "content": f"DOCUMENT_CONTEXT_JSON={ctx_json}"},
            {"role": "user", "content": question},
        ]

        resp = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.2,
        )
        return resp.choices[0].message.content or ""
