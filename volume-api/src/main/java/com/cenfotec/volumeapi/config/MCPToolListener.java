package com.cenfotec.volumeapi.config;

import io.modelcontextprotocol.client.McpSyncClient;
import org.springframework.ai.mcp.SyncMcpToolCallbackProvider;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.definition.ToolDefinition;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MCPToolListener implements CommandLineRunner {

    private final List<McpSyncClient> mcpClients;

    public MCPToolListener(List<McpSyncClient> mcpClients) {
        this.mcpClients = mcpClients;
    }


    @Override
    public void run(String... args){
        System.out.println("Discovering MCP Tools:");
        for(McpSyncClient client : mcpClients){
            System.out.println("------------------------------------------------------------");
            System.out.println("Connected to MCP Client: " + client.getClientInfo().name());

            SyncMcpToolCallbackProvider provider = new SyncMcpToolCallbackProvider(List.of(client));
            List<ToolCallback> toolCallbacks = List.of(provider.getToolCallbacks());

            if(toolCallbacks.isEmpty()){
                System.out.println("No tools found on this MCP server");
            } else {
                for(ToolCallback toolCallback : toolCallbacks){
                    ToolDefinition toolDefinition = toolCallback.getToolDefinition();
                    System.out.println("Tool Name: " + toolDefinition.name());
                    System.out.println("Description: " + toolDefinition.description());
                    System.out.println("Input Schema: " + toolDefinition.inputSchema());
                    System.out.println("----");
                }
            }
        }
    }

}
