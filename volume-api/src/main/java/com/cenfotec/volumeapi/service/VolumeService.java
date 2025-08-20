package com.cenfotec.volumeapi.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.Optional;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;

import com.cenfotec.volumeapi.models.ChatRequest;
import com.cenfotec.volumeapi.models.ChatResponse;

@Service
public class VolumeService {

    private final ChatClient chatClient;
    private final Map<String, List<Message>> conversationHistory = new HashMap<>();

    public VolumeService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public ChatResponse chat(ChatRequest chatRequest) {
        UUID chatId = Optional.ofNullable(chatRequest.chatId()).orElse(UUID.randomUUID());
        String chatIdStr = chatId.toString();
        List<Message> history = conversationHistory.computeIfAbsent(chatIdStr, k -> new ArrayList<>());
        if (history.size() > 2) { // Limit to 10 messages (5 user + 5 assistant)
            history = history.subList(history.size() - 20, history.size());
            conversationHistory.put(chatIdStr, history);
        }
        String answer = chatClient
                .prompt()
                .messages(history)
                .user(chatRequest.question())
                .call()
                .content();
        history.add(new UserMessage(chatRequest.question()));
        history.add(new AssistantMessage(answer));
        conversationHistory.put(chatIdStr, history);
        return new ChatResponse(chatId, answer);
    }
}
