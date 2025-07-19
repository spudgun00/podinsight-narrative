#!/usr/bin/env python3
"""
Graphiti MCP Server for Claude persistent memory
"""

import os
import json
import logging
from typing import Any, Dict, List, Optional
from datetime import datetime

from mcp.server import Server
from mcp.server.models import InitializationOptions
from mcp.types import Tool, TextContent, CallToolRequest, CallToolResult

from graphiti_core import Graphiti
from graphiti_core.nodes import EpisodeType
from graphiti_core.search import SearchConfig

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize MCP server
server = Server("graphiti-memory")

# Global Graphiti instance
graphiti: Optional[Graphiti] = None


@server.list_tools()
async def list_tools() -> List[Tool]:
    """List available memory tools"""
    return [
        Tool(
            name="memory_add",
            description="Add a new memory/episode to the knowledge graph",
            inputSchema={
                "type": "object",
                "properties": {
                    "content": {
                        "type": "string",
                        "description": "The content to store in memory"
                    },
                    "name": {
                        "type": "string",
                        "description": "Optional name/title for this memory"
                    },
                    "entity_name": {
                        "type": "string",
                        "description": "Optional entity name to associate with"
                    },
                    "source": {
                        "type": "string",
                        "description": "Source of the memory (e.g., 'conversation', 'document')"
                    }
                },
                "required": ["content"]
            }
        ),
        Tool(
            name="memory_search",
            description="Search memories in the knowledge graph",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Maximum number of results (default: 10)"
                    },
                    "search_type": {
                        "type": "string",
                        "enum": ["similarity", "keyword", "hybrid"],
                        "description": "Type of search to perform (default: hybrid)"
                    }
                },
                "required": ["query"]
            }
        ),
        Tool(
            name="memory_get_context",
            description="Get contextual memories related to a topic or entity",
            inputSchema={
                "type": "object",
                "properties": {
                    "entity_name": {
                        "type": "string",
                        "description": "Entity name to get context for"
                    },
                    "topic": {
                        "type": "string",
                        "description": "Topic to get context for"
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Maximum number of related memories (default: 20)"
                    }
                },
                "required": []
            }
        ),
        Tool(
            name="memory_list_entities",
            description="List all entities in the knowledge graph",
            inputSchema={
                "type": "object",
                "properties": {
                    "limit": {
                        "type": "integer",
                        "description": "Maximum number of entities to return (default: 50)"
                    }
                },
                "required": []
            }
        ),
        Tool(
            name="memory_get_entity",
            description="Get detailed information about a specific entity",
            inputSchema={
                "type": "object",
                "properties": {
                    "entity_name": {
                        "type": "string",
                        "description": "Name of the entity to retrieve"
                    }
                },
                "required": ["entity_name"]
            }
        )
    ]


@server.call_tool()
async def call_tool(tool_call: CallToolRequest) -> CallToolResult:
    """Handle tool calls for memory operations"""
    global graphiti
    
    if not graphiti:
        return CallToolResult(
            content=[TextContent(text="Error: Graphiti not initialized")],
            isError=True
        )
    
    try:
        tool_name = tool_call.tool.name
        args = tool_call.tool.arguments or {}
        
        if tool_name == "memory_add":
            # Add new memory
            content = args["content"]
            name = args.get("name", f"Memory_{datetime.now().isoformat()}")
            entity_name = args.get("entity_name")
            source = args.get("source", "conversation")
            
            # Create episode
            episode = await graphiti.build_episode(
                name=name,
                source=source,
                content=content,
                timestamp=datetime.now(),
                episode_type=EpisodeType.text
            )
            
            # Add to graph
            await graphiti.add_episode(
                episode=episode,
                entity_name=entity_name
            )
            
            return CallToolResult(
                content=[TextContent(text=f"Memory added successfully: {name}")]
            )
            
        elif tool_name == "memory_search":
            # Search memories
            query = args["query"]
            limit = args.get("limit", 10)
            search_type = args.get("search_type", "hybrid")
            
            config = SearchConfig(
                limit=limit,
                search_type=search_type
            )
            
            results = await graphiti.search(query, config)
            
            # Format results
            formatted_results = []
            for i, result in enumerate(results):
                formatted_results.append(
                    f"{i+1}. {result.content}\n"
                    f"   Score: {result.score:.3f}\n"
                    f"   Source: {result.source}"
                )
            
            output = "\n\n".join(formatted_results) if formatted_results else "No results found"
            
            return CallToolResult(
                content=[TextContent(text=output)]
            )
            
        elif tool_name == "memory_get_context":
            # Get contextual memories
            entity_name = args.get("entity_name")
            topic = args.get("topic")
            limit = args.get("limit", 20)
            
            # Build search query
            search_query = []
            if entity_name:
                search_query.append(f"entity:{entity_name}")
            if topic:
                search_query.append(topic)
            
            if not search_query:
                return CallToolResult(
                    content=[TextContent(text="Please provide either entity_name or topic")],
                    isError=True
                )
            
            query = " ".join(search_query)
            config = SearchConfig(limit=limit, search_type="hybrid")
            
            results = await graphiti.search(query, config)
            
            # Format contextual results
            context_items = []
            for result in results:
                context_items.append(
                    f"• {result.content}\n"
                    f"  (Source: {result.source}, Score: {result.score:.3f})"
                )
            
            output = "\n".join(context_items) if context_items else "No context found"
            
            return CallToolResult(
                content=[TextContent(text=f"Context for {query}:\n\n{output}")]
            )
            
        elif tool_name == "memory_list_entities":
            # List entities
            limit = args.get("limit", 50)
            
            # Get all nodes (entities)
            nodes = await graphiti.get_nodes(limit=limit)
            
            entity_list = []
            for node in nodes:
                entity_list.append(f"• {node.name} ({node.type})")
            
            output = "\n".join(entity_list) if entity_list else "No entities found"
            
            return CallToolResult(
                content=[TextContent(text=f"Entities in knowledge graph:\n\n{output}")]
            )
            
        elif tool_name == "memory_get_entity":
            # Get entity details
            entity_name = args["entity_name"]
            
            # Get node details
            node = await graphiti.get_node_by_name(entity_name)
            
            if not node:
                return CallToolResult(
                    content=[TextContent(text=f"Entity '{entity_name}' not found")]
                )
            
            # Get relationships
            relationships = await graphiti.get_node_relationships(node.id)
            
            # Format output
            output = f"Entity: {node.name}\n"
            output += f"Type: {node.type}\n"
            output += f"Created: {node.created_at}\n\n"
            
            if relationships:
                output += "Relationships:\n"
                for rel in relationships:
                    output += f"• {rel.type} -> {rel.target_name}\n"
            
            return CallToolResult(
                content=[TextContent(text=output)]
            )
            
        else:
            return CallToolResult(
                content=[TextContent(text=f"Unknown tool: {tool_name}")],
                isError=True
            )
            
    except Exception as e:
        logger.error(f"Error executing tool {tool_call.tool.name}: {str(e)}")
        return CallToolResult(
            content=[TextContent(text=f"Error: {str(e)}")],
            isError=True
        )


@server.initialize()
async def initialize(options: InitializationOptions) -> None:
    """Initialize the Graphiti connection"""
    global graphiti
    
    try:
        # Get configuration from environment
        neo4j_uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        neo4j_user = os.getenv("NEO4J_USER", "neo4j")
        neo4j_password = os.getenv("NEO4J_PASSWORD", "password")
        
        # Initialize Graphiti
        graphiti = Graphiti(
            uri=neo4j_uri,
            user=neo4j_user,
            password=neo4j_password
        )
        
        # Initialize indices
        await graphiti.build_indices()
        
        logger.info(f"Connected to Neo4j at {neo4j_uri}")
        
    except Exception as e:
        logger.error(f"Failed to initialize Graphiti: {str(e)}")
        raise


@server.shutdown()
async def shutdown() -> None:
    """Clean shutdown"""
    global graphiti
    
    if graphiti:
        await graphiti.close()
        graphiti = None
        logger.info("Graphiti connection closed")


if __name__ == "__main__":
    import asyncio
    import sys
    
    # Run the MCP server
    asyncio.run(server.run(
        transport="stdio",
        init_options=InitializationOptions()
    ))