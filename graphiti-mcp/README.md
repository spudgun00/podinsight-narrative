# Simple MCP Memory Server for Claude

A lightweight Model Context Protocol (MCP) server that provides persistent memory capabilities for Claude Code using Neo4j as the backend.

## Overview

This setup provides Claude with persistent memory across sessions, allowing it to remember conversations, preferences, and project details. The system uses a simple MCP server that stores memories in a searchable format.

## Architecture

```
Claude Code → MCP Server → Neo4j Database
```

- **Neo4j**: Graph database for storing memories and relationships
- **Simple MCP Server**: Lightweight server handling memory operations
- **Claude Code**: Configured to use the MCP server for memory functions

## Quick Start

### 1. Prerequisites

- Docker and Docker Compose installed
- OpenAI API key (set in `.env` file)
- Claude Code installed and configured

### 2. Start the Memory System

```bash
# Navigate to the project directory
cd /Users/jamesgill/PodInsights/podinsight-narrative

# Start Neo4j and MCP server
docker-compose up -d

# Check if containers are running
docker ps
```

You should see both containers running:
- `podinsight-neo4j` (Neo4j database)
- `podinsight-graphiti-mcp` (MCP server)

### 3. Configure Claude Code

The MCP server is already configured in Claude Code. To verify:

```bash
# Check MCP configuration
claude mcp list

# You should see:
# ✓ graphiti-memory (stdio)
```

## Usage Examples

### Basic Memory Operations

**Store a memory:**
```
Remember that I prefer TypeScript over JavaScript for this project.
```

**Search memories:**
```
What do you remember about my programming language preferences?
```

**Store project details:**
```
Remember that the PodInsight project uses Next.js 14, React 18, and has a sage green color palette.
```

**Retrieve project context:**
```
What do you remember about the PodInsight project?
```

### Advanced Usage

**Store complex information:**
```
Remember that the Notable Signals component has 5 signal types: Market Narratives, Thesis Validation, Notable Deals, Portfolio Mentions, and LP Sentiment.
```

**Search specific topics:**
```
What do you remember about the Notable Signals component?
```

## How to Verify It's Working

### 1. Check Container Status

```bash
# Check if containers are running
docker ps | grep podinsight

# Should show:
# podinsight-neo4j        (healthy)
# podinsight-graphiti-mcp (running)
```

### 2. Check MCP Server Logs

```bash
# View MCP server logs
docker logs podinsight-graphiti-mcp

# Should show:
# Simple MCP Server started
```

### 3. Test Memory in Claude

```bash
# Ask Claude to remember something
"Remember that today is $(date) and we successfully set up persistent memory"

# Then ask Claude to recall it
"What do you remember about setting up persistent memory?"
```

### 4. Check Neo4j Browser

1. Open [http://localhost:7474](http://localhost:7474)
2. Login with:
   - Username: `neo4j`
   - Password: `podinsight123`
3. Run query: `MATCH (n) RETURN n LIMIT 10`

## Troubleshooting

### Problem: Containers Won't Start

**Check Docker:**
```bash
# Ensure Docker is running
docker info

# Check for port conflicts
lsof -i :7474  # Neo4j HTTP
lsof -i :7687  # Neo4j Bolt
```

**Solution:**
```bash
# Stop conflicting services or change ports in docker-compose.yml
docker-compose down
docker-compose up -d
```

### Problem: MCP Server Not Responding

**Check logs:**
```bash
# View detailed logs
docker logs --follow podinsight-graphiti-mcp
```

**Common issues:**
- **"Simple MCP Server started"** repeating → Server restarting, check for Python errors
- **Module import errors** → Container configuration issue

**Solution:**
```bash
# Restart MCP server
docker-compose restart graphiti-mcp
```

### Problem: Claude Can't Access Memory

**Check MCP configuration:**
```bash
# List MCP servers
claude mcp list

# Should show graphiti-memory as active
```

**Check connection:**
```bash
# Test MCP server directly
docker exec -it podinsight-graphiti-mcp python -c "print('MCP server accessible')"
```

**Solution:**
```bash
# Restart Claude Code
# Or reconfigure MCP server
claude mcp remove graphiti-memory
claude mcp add graphiti-memory docker -e PYTHONUNBUFFERED=1 -- exec -i podinsight-graphiti-mcp python /app/simple-mcp-server.py
```

### Problem: Memory Not Persisting

**Check Neo4j:**
```bash
# Access Neo4j browser: http://localhost:7474
# Login: neo4j / podinsight123
# Run: MATCH (n) RETURN count(n)
```

**Check data volume:**
```bash
# Verify data volume exists
docker volume ls | grep neo4j
```

### Problem: Performance Issues

**Check resource usage:**
```bash
# Monitor container resources
docker stats podinsight-neo4j podinsight-graphiti-mcp
```

**Optimize Neo4j:**
```bash
# Increase memory in docker-compose.yml
# Add environment variables:
# NEO4J_dbms_memory_pagecache_size=1G
# NEO4J_dbms_memory_heap_max__size=1G
```

## File Structure

```
graphiti-mcp/
├── README.md                  # This file
├── simple-mcp-server.py      # MCP server implementation
├── mcp_config.json           # MCP configuration template
├── Dockerfile               # Original Dockerfile (not used)
├── requirements.txt         # Python dependencies (not used)
└── server.py               # Original server attempt (not used)
```

## Configuration Files

### docker-compose.yml
Main configuration file that defines:
- Neo4j database service
- MCP server service
- Network configuration
- Volume mounts

### .env
Environment variables:
```bash
OPENAI_API_KEY=your_key_here
NEO4J_PASSWORD=podinsight123
```

## Memory Server Details

The simple MCP server provides these tools:
- `memory_add`: Store new information
- `memory_search`: Search stored memories

**Data format:**
```json
{
  "id": "unique_id",
  "content": "memory content",
  "timestamp": "creation_time"
}
```

## Maintenance

### Regular Tasks

**Check system health:**
```bash
# Daily health check
docker ps
docker logs --tail 10 podinsight-graphiti-mcp
```

**Backup memories:**
```bash
# Backup Neo4j data
docker exec podinsight-neo4j neo4j-admin dump --database=neo4j --to=/tmp/backup.dump
```

**Clean up:**
```bash
# Remove old containers
docker system prune

# Clear memory cache (if needed)
docker exec podinsight-neo4j cypher-shell -u neo4j -p podinsight123 "MATCH (n) DELETE n"
```

### Updating

**Update MCP server:**
1. Edit `simple-mcp-server.py`
2. Restart: `docker-compose restart graphiti-mcp`

**Update Neo4j:**
1. Change image version in `docker-compose.yml`
2. Restart: `docker-compose up -d`

## Security Notes

- Change default Neo4j password in production
- Use environment variables for sensitive data
- Restrict Neo4j access to localhost only
- Regular security updates for base images

## Support

For issues:
1. Check logs: `docker logs podinsight-graphiti-mcp`
2. Verify configuration: `claude mcp list`
3. Test manually: Use Neo4j browser
4. Restart services: `docker-compose restart`

---

**Status**: ✅ Working - Simple MCP server providing basic persistent memory
**Last Updated**: $(date)
**Version**: 1.0.0