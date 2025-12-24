import json
from django.http import JsonResponse
from mcp.resources import read_resource

def mcp_jsonrpc(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"jsonrpc": "2.0", "error": {"code": -32700, "message": "Parse error"}}, status=400)

    req_id = payload.get("id")
    method = payload.get("method")
    params = payload.get("params") or {}

    try:
        if method == "resources/read":
            uri = params.get("uri")
            if not uri:
                raise ValueError("Missing uri")
            result = read_resource(uri)
            return JsonResponse({"jsonrpc": "2.0", "id": req_id, "result": result})

        return JsonResponse({"jsonrpc": "2.0", "id": req_id, "error": {"code": -32601, "message": "Method not found"}}, status=404)
    except Exception as e:
        return JsonResponse({"jsonrpc": "2.0", "id": req_id, "error": {"code": -32000, "message": str(e)}}, status=400)
