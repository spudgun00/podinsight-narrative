#!/bin/bash

echo "🧠 Setting up Graphiti Persistent Memory for Claude..."
echo ""

# Check if .env exists and has OPENAI_API_KEY
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env and add your OPENAI_API_KEY"
    exit 1
fi

if ! grep -q "OPENAI_API_KEY=" .env || grep -q "OPENAI_API_KEY=your_openai_api_key_here" .env; then
    echo "❌ Please set your OPENAI_API_KEY in the .env file"
    echo "Edit .env and replace 'your_openai_api_key_here' with your actual key"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Prerequisites checked"
echo ""

# Build and start services
echo "🚀 Starting Neo4j and Graphiti MCP server..."
docker-compose up -d --build

# Wait for Neo4j to be ready
echo ""
echo "⏳ Waiting for Neo4j to be ready..."
sleep 10

# Check if services are running
if docker ps | grep -q podinsight-neo4j && docker ps | grep -q podinsight-graphiti-mcp; then
    echo "✅ Services are running!"
    echo ""
    echo "📊 Neo4j Browser: http://localhost:7474"
    echo "   Username: neo4j"
    echo "   Password: podinsight123"
    echo ""
    echo "🔧 Configure Claude Code:"
    echo "1. Copy the MCP configuration:"
    echo "   cat graphiti-mcp/mcp_config.json"
    echo ""
    echo "2. Add it to your Claude Code settings"
    echo ""
    echo "3. Restart Claude Code to enable persistent memory"
    echo ""
    echo "📝 Example usage in Claude:"
    echo "   - 'Remember that the user prefers TypeScript over JavaScript'"
    echo "   - 'What do you remember about my project preferences?'"
    echo "   - 'List all the entities you know about'"
else
    echo "❌ Failed to start services. Check logs with:"
    echo "   docker-compose logs"
    exit 1
fi