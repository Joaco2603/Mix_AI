package com.cenfotec.volumeapi.config;

import io.modelcontextprotocol.client.McpSyncClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.mcp.SyncMcpToolCallbackProvider;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.definition.ToolDefinition;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class MCPToolListener implements CommandLineRunner {

    private final List<McpSyncClient> mcpClients;

    public MCPToolListener(List<McpSyncClient> mcpClients) {
        this.mcpClients = mcpClients;
    }


    @Override
    public void run(String... args){
        log.info("Discovering MCP Tools:");
        for(McpSyncClient client : mcpClients){
            log.info("------------------------------------------------------------");
            log.info("Connected to MCP Client: {}", client.getClientInfo().name());

            SyncMcpToolCallbackProvider provider = new SyncMcpToolCallbackProvider(List.of(client));
            List<ToolCallback> toolCallbacks = List.of(provider.getToolCallbacks());

            if(toolCallbacks.isEmpty()){
                log.info("No tools found on this MCP server");
            } else {
                for(ToolCallback toolCallback : toolCallbacks){
                    ToolDefinition toolDefinition = toolCallback.getToolDefinition();
                    log.info("Tool Name: {}", toolDefinition.name());
                    log.info("Description: {}", toolDefinition.description());
                    log.info("Input Schema: {}", toolDefinition.inputSchema());
                    log.info("----");
                }
            }
        }
    }

}
