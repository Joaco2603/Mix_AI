package com.cenfotec.volumeapi.controller;


import com.cenfotec.volumeapi.models.ChatRequest;
import com.cenfotec.volumeapi.models.ChatResponse;
import com.cenfotec.volumeapi.service.VolumeService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat")
public class ChatRestController {

    private final VolumeService volumeService;

    public ChatRestController(VolumeService volumeService) {
        this.volumeService = volumeService;
    }

    @PostMapping
    ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest chatRequest){
        ChatResponse answer = volumeService.chat(chatRequest);
        return ResponseEntity.ok(answer);
    }
}
