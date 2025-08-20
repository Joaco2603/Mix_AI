package com.cenfotec.volumeapi.controller;

import com.cenfotec.volumeapi.service.VolumeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ChatRestController.class)
class ChatRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VolumeService volumeService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void should_return_chat_response_when_valid_message_sent() throws Exception {
        // Given
        String userMessage = "sube el volumen del piano";
        String expectedResponse = "Volumen del piano aumentado a nivel 7";
        
        when(volumeService.processChat(anyString())).thenReturn(expectedResponse);

        // When & Then
        mockMvc.perform(post("/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"message\":\"" + userMessage + "\"}"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.response").value(expectedResponse));
    }

    @Test
    void should_return_400_when_empty_message() throws Exception {
        // When & Then
        mockMvc.perform(post("/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void should_return_400_when_null_message() throws Exception {
        // When & Then
        mockMvc.perform(post("/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"message\":null}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void should_handle_audio_volume_commands() throws Exception {
        // Given
        String command = "baja el volumen de la guitarra";
        String expectedResponse = "Volumen de la guitarra reducido a nivel 3";
        
        when(volumeService.processChat(command)).thenReturn(expectedResponse);

        // When & Then
        mockMvc.perform(post("/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"message\":\"" + command + "\"}"))
                .andExpected(status().isOk())
                .andExpect(jsonPath("$.response").value(expectedResponse));
    }

    @Test
    void should_handle_mute_commands() throws Exception {
        // Given
        String command = "mutea la batería";
        String expectedResponse = "Batería silenciada";
        
        when(volumeService.processChat(command)).thenReturn(expectedResponse);

        // When & Then
        mockMvc.perform(post("/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"message\":\"" + command + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(expectedResponse));
    }
}
