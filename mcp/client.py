import os
import requests

class MCPClient:
    def __init__(self, base_url: str | None = None):
        self.base_url = base_url or os.getenv("MCP_URL", "http://127.0.0.1:8000/mcp/")

    def read_resource(self, uri: str) -> dict:
        payload = {"jsonrpc": "2.0", "id": "1", "method": "resources/read", "params": {"uri": uri}}
        r = requests.post(self.base_url, json=payload, timeout=10)
        r.raise_for_status()
        data = r.json()
        if "error" in data:
            raise RuntimeError(data["error"]["message"])
        return data["result"]
