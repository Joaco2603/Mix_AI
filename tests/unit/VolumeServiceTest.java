package com.cenfotec.volumeapi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VolumeServiceTest {

    @Mock
    private ChatClient chatClient;

    @Mock
    private ChatResponse chatResponse;

    @Mock
    private Generation generation;

    private VolumeService volumeService;

    @BeforeEach
    void setUp() {
        volumeService = new VolumeService(chatClient);
    }

    @Test
    void should_process_volume_increase_command() {
        // Given
        String userInput = "sube el volumen del piano";
        String expectedOutput = "Volumen del piano aumentado correctamente";
        
        when(chatClient.prompt(any())).thenReturn(chatResponse);
        when(chatResponse.getResult()).thenReturn(generation);
        when(generation.getOutput()).thenReturn(expectedOutput);

        // When
        String result = volumeService.processChat(userInput);

        // Then
        assertNotNull(result);
        assertEquals(expectedOutput, result);
        verify(chatClient, times(1)).prompt(any());
    }

    @Test
    void should_process_volume_decrease_command() {
        // Given
        String userInput = "baja el volumen de la guitarra";
        String expectedOutput = "Volumen de la guitarra reducido correctamente";
        
        when(chatClient.prompt(any())).thenReturn(chatResponse);
        when(chatResponse.getResult()).thenReturn(generation);
        when(generation.getOutput()).thenReturn(expectedOutput);

        // When
        String result = volumeService.processChat(userInput);

        // Then
        assertEquals(expectedOutput, result);
    }

    @Test
    void should_process_mute_command() {
        // Given
        String userInput = "mutea la batería";
        String expectedOutput = "Batería silenciada";
        
        when(chatClient.prompt(any())).thenReturn(chatResponse);
        when(chatResponse.getResult()).thenReturn(generation);
        when(generation.getOutput()).thenReturn(expectedOutput);

        // When
        String result = volumeService.processChat(userInput);

        // Then
        assertEquals(expectedOutput, result);
    }

    @Test
    void should_handle_list_instruments_command() {
        // Given
        String userInput = "lista los instrumentos disponibles";
        String expectedOutput = "Instrumentos disponibles: piano, guitarra, batería, bajo, voz";
        
        when(chatClient.prompt(any())).thenReturn(chatResponse);
        when(chatResponse.getResult()).thenReturn(generation);
        when(generation.getOutput()).thenReturn(expectedOutput);

        // When
        String result = volumeService.processChat(userInput);

        // Then
        assertEquals(expectedOutput, result);
    }

    @Test
    void should_handle_non_audio_questions() {
        // Given
        String userInput = "¿cuál es la capital de Francia?";
        String expectedOutput = "Solo puedo ayudarte con comandos relacionados con audio y música.";
        
        when(chatClient.prompt(any())).thenReturn(chatResponse);
        when(chatResponse.getResult()).thenReturn(generation);
        when(generation.getOutput()).thenReturn(expectedOutput);

        // When
        String result = volumeService.processChat(userInput);

        // Then
        assertEquals(expectedOutput, result);
    }

    @Test
    void should_handle_empty_input() {
        // Given
        String userInput = "";
        
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            volumeService.processChat(userInput);
        });
    }

    @Test
    void should_handle_null_input() {
        // Given
        String userInput = null;
        
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            volumeService.processChat(userInput);
        });
    }
}
