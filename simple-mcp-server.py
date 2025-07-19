#!/usr/bin/env python3
"""
Simple Graphiti MCP Server for Claude persistent memory
"""

import asyncio
import json
import logging
import os
from typing import Any, Dict, List, Optional

# Simple MCP implementation without complex dependencies
class SimpleMCPServer:
    def __init__(self):
        self.memories = {}
        self.entities = {}
        
    async def handle_request(self, request: str) -> str:
        """Handle MCP requests"""
        try:
            data = json.loads(request)
            method = data.get('method')
            params = data.get('params', {})
            
            if method == 'tools/list':
                return json.dumps({
                    "tools": [
                        {
                            "name": "memory_add",
                            "description": "Add a new memory",
                            "inputSchema": {
                                "type": "object",
                                "properties": {
                                    "content": {"type": "string"}
                                }
                            }
                        },
                        {
                            "name": "memory_search",
                            "description": "Search memories",
                            "inputSchema": {
                                "type": "object",
                                "properties": {
                                    "query": {"type": "string"}
                                }
                            }
                        }
                    ]
                })
            
            elif method == 'tools/call':
                tool_name = params.get('name')
                args = params.get('arguments', {})
                
                if tool_name == 'memory_add':
                    content = args.get('content', '')
                    memory_id = len(self.memories)
                    self.memories[memory_id] = {
                        'content': content,
                        'timestamp': asyncio.get_event_loop().time()
                    }
                    return json.dumps({
                        "content": [{"type": "text", "text": f"Memory {memory_id} added: {content}"}]
                    })
                
                elif tool_name == 'memory_search':
                    query = args.get('query', '')
                    results = []
                    for mem_id, memory in self.memories.items():
                        if query.lower() in memory['content'].lower():
                            results.append(f"{mem_id}: {memory['content']}")
                    
                    return json.dumps({
                        "content": [{"type": "text", "text": f"Found {len(results)} memories:\\n" + "\\n".join(results)}]
                    })
            
            return json.dumps({"error": "Unknown method"})
            
        except Exception as e:
            return json.dumps({"error": str(e)})

async def main():
    """Run the simple MCP server"""
    server = SimpleMCPServer()
    
    # Simple stdio loop
    print("Simple MCP Server started", flush=True)
    
    while True:
        try:
            line = input()
            if line.strip():
                response = await server.handle_request(line)
                print(response, flush=True)
        except EOFError:
            break
        except Exception as e:
            print(json.dumps({"error": str(e)}), flush=True)

if __name__ == "__main__":
    asyncio.run(main())