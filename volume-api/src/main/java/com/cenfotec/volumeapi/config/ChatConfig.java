package com.cenfotec.volumeapi.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.mcp.SyncMcpToolCallbackProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChatConfig {

    @Bean
    ChatClient chatClient(@Qualifier("vertexAiGeminiChat") ChatModel chatModel, SyncMcpToolCallbackProvider toolCallbackProvider){
    // ChatClient chatClient(@Qualifier("ollamaChatModel") ChatModel chatModel, SyncMcpToolCallbackProvider toolCallbackProvider){
        return ChatClient
                .builder(chatModel)
                .defaultToolCallbacks(toolCallbackProvider.getToolCallbacks())
                .defaultSystem("You are a friend chat bot that helps manage line volumes at a mixer. don't answer any questions that are not provided in the tool callbakcs. Don't mention anything about tools. Use friendly language to respond that you won't answer any question s not associated to the tools.")
                .build();
    }

}
