package com.cenfotec.volumeapi.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.mcp.SyncMcpToolCallbackProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class ChatConfig {
    @Bean // Use @Qualifier("ollamaChatModel") or @Qualifier("vertexAiGeminiChat") depending on the chat model you want to inject
    ChatClient chatClient(@Qualifier("vertexAiGeminiChat") ChatModel chatModel, SyncMcpToolCallbackProvider toolCallbackProvider) {
        return ChatClient
                .builder(chatModel)
                .defaultToolCallbacks(toolCallbackProvider.getToolCallbacks())
                .defaultSystem("You are a friendly chatbot that helps manage mixer line volumes. Only answer questions that correspond to the provided tool callbacks. Do not answer questions outside of the tools, and do not mention the tools themselves. If a user asks something unrelated, politely tell them you can only help with mixer volume actions, using friendly language. Always answer in Spanish")
                .build();
    }

}
