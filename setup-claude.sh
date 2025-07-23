#!/bin/bash

# Voting System - Claude Code Setup Script
# This script sets up Claude Code MCP configuration for database access

echo "🚀 Setting up Claude Code MCP configuration..."

# Create .claude-code directory if it doesn't exist
mkdir -p .claude-code

# Copy MCP template to active configuration
if [ -f ".claude-code/mcp.json.template" ]; then
    cp .claude-code/mcp.json.template .claude-code/mcp.json
    echo "✅ MCP configuration created from template"
else
    # Fallback: create the configuration manually
    cat > .claude-code/mcp.json << 'EOF'
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://postgres:password@localhost:5433/voting_system"
      }
    }
  }
}
EOF
    echo "✅ MCP configuration created manually"
fi

echo ""
echo "🎯 Claude Code is now configured!"
echo ""
echo "Next steps:"
echo "1. Start the database: docker compose up -d"
echo "2. Open this project in Claude Code"
echo "3. Use /mcp commands to query the database"
echo ""
echo "Example MCP commands:"
echo "• /mcp - Show available MCP tools"
echo "• Query users: SELECT * FROM users LIMIT 5;"
echo "• Query features: SELECT * FROM features_with_votes LIMIT 5;"