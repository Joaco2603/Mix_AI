package com.cenfotec.mixia.integration;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.TestPropertySource;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
    "spring.ai.gemini.api-key=test-llm-integration-key",
    "firmware.base.url=http://localhost:3001",
    "llm.timeout=5000"
})
class LlmIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String baseUrl;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port;
    }

    @Test
    void should_interpret_natural_language_volume_commands() throws Exception {
        // Given - Various natural language expressions
        String[] volumeCommands = {
            "pon el piano más alto",
            "sube un poco el volumen de la guitarra",
            "aumenta la batería al máximo",
            "el bajo está muy bajito, súbelo",
            "quiero escuchar más la voz"
        };

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // When & Then - Each command should be interpreted correctly
        for (String command : volumeCommands) {
            String requestBody = "{\"message\":\"" + command + "\"}";
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                baseUrl + "/chat", 
                request, 
                String.class
            );

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            
            // Response should indicate volume change
            String responseBody = response.getBody().toLowerCase();
            assertTrue(responseBody.contains("volumen") || 
                      responseBody.contains("nivel") ||
                      responseBody.contains("aumenta") ||
                      responseBody.contains("sube"));
        }
    }

    @Test
    void should_interpret_natural_language_mute_commands() throws Exception {
        // Given - Various mute expressions
        String[] muteCommands = {
            "silencia la batería",
            "que no se escuche el piano",
            "apaga la guitarra por favor",
            "mutea el bajo completamente",
            "quita el sonido de la voz"
        };

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // When & Then
        for (String command : muteCommands) {
            String requestBody = "{\"message\":\"" + command + "\"}";
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                baseUrl + "/chat", 
                request, 
                String.class
            );

            assertEquals(HttpStatus.OK, response.getStatusCode());
            
            String responseBody = response.getBody().toLowerCase();
            assertTrue(responseBody.contains("mute") || 
                      responseBody.contains("silencia") ||
                      responseBody.contains("apaga") ||
                      responseBody.contains("sin sonido"));
        }
    }

    @Test
    void should_handle_complex_multi_instrument_commands() throws Exception {
        // Given - Complex commands affecting multiple instruments
        String[] complexCommands = {
            "baja el piano y sube la guitarra",
            "mutea la batería pero aumenta el bajo",
            "pon todos los instrumentos al mismo nivel",
            "quiero escuchar solo el piano y la voz",
            "haz un balance entre guitarra y batería"
        };

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // When & Then
        for (String command : complexCommands) {
            String requestBody = "{\"message\":\"" + command + "\"}";
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                baseUrl + "/chat", 
                request, 
                String.class
            );

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            
            // Should handle multiple instruments
            String responseBody = response.getBody().toLowerCase();
            int instrumentCount = 0;
            String[] instruments = {"piano", "guitarra", "batería", "bateria", "bajo", "voz"};
            
            for (String instrument : instruments) {
                if (responseBody.contains(instrument)) {
                    instrumentCount++;
                }
            }
            
            assertTrue(instrumentCount >= 2, "Should handle multiple instruments in: " + command);
        }
    }

    @Test
    void should_reject_non_audio_questions_with_context() throws Exception {
        // Given - Non-audio related questions
        String[] nonAudioQuestions = {
            "¿Qué tiempo hace hoy?",
            "¿Cuál es la capital de España?",
            "¿Cómo se hace una tortilla?",
            "¿Qué día es hoy?",
            "¿Puedes resolver esta ecuación matemática?"
        };

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // When & Then
        for (String question : nonAudioQuestions) {
            String requestBody = "{\"message\":\"" + question + "\"}";
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                baseUrl + "/chat", 
                request, 
                String.class
            );

            assertEquals(HttpStatus.OK, response.getStatusCode());
            
            String responseBody = response.getBody().toLowerCase();
            assertTrue(responseBody.contains("audio") || 
                      responseBody.contains("música") ||
                      responseBody.contains("sonido") ||
                      responseBody.contains("instrumentos") ||
                      responseBody.contains("solo puedo ayudar"));
        }
    }

    @Test
    void should_provide_helpful_responses_for_unclear_commands() throws Exception {
        // Given - Ambiguous or unclear commands
        String[] unclearCommands = {
            "haz algo con el sonido",
            "mejora el audio",
            "no me gusta como suena",
            "arregla la música",
            "cambia algo en el mixer"
        };

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // When & Then
        for (String command : unclearCommands) {
            String requestBody = "{\"message\":\"" + command + "\"}";
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                baseUrl + "/chat", 
                request, 
                String.class
            );

            assertEquals(HttpStatus.OK, response.getStatusCode());
            
            String responseBody = response.getBody().toLowerCase();
            // Should ask for clarification or provide options
            assertTrue(responseBody.contains("específico") || 
                      responseBody.contains("aclarar") ||
                      responseBody.contains("instrumento") ||
                      responseBody.contains("volumen") ||
                      responseBody.contains("qué instrumento"));
        }
    }

    @Test
    void should_handle_conversational_context() throws Exception {
        // Given - Conversational sequence
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // First message - establish context
        String firstMessage = "sube el volumen del piano";
        String requestBody1 = "{\"message\":\"" + firstMessage + "\"}";
        HttpEntity<String> request1 = new HttpEntity<>(requestBody1, headers);

        ResponseEntity<String> response1 = restTemplate.postForEntity(
            baseUrl + "/chat", 
            request1, 
            String.class
        );

        assertEquals(HttpStatus.OK, response1.getStatusCode());

        // Second message - reference previous context
        String secondMessage = "ahora bájalo un poco";
        String requestBody2 = "{\"message\":\"" + secondMessage + "\"}";
        HttpEntity<String> request2 = new HttpEntity<>(requestBody2, headers);

        ResponseEntity<String> response2 = restTemplate.postForEntity(
            baseUrl + "/chat", 
            request2, 
            String.class
        );

        // Then - Should understand "bájalo" refers to piano
        assertEquals(HttpStatus.OK, response2.getStatusCode());
        String responseBody = response2.getBody().toLowerCase();
        assertTrue(responseBody.contains("piano") || 
                  responseBody.contains("bajado") ||
                  responseBody.contains("reducido"));
    }

    @Test
    void should_handle_llm_service_timeout() throws Exception {
        // Given - This simulates LLM taking too long
        String command = "esta es una consulta muy compleja que podría tomar mucho tiempo en procesar y generar una respuesta muy elaborada";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String requestBody = "{\"message\":\"" + command + "\"}";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        // When
        long startTime = System.currentTimeMillis();
        ResponseEntity<String> response = restTemplate.postForEntity(
            baseUrl + "/chat", 
            request, 
            String.class
        );
        long endTime = System.currentTimeMillis();

        // Then - Should complete within reasonable time (or handle timeout)
        assertTrue(endTime - startTime < 10000, "Request should complete within 10 seconds");
        
        if (response.getStatusCode() == HttpStatus.OK) {
            assertNotNull(response.getBody());
        } else if (response.getStatusCode() == HttpStatus.REQUEST_TIMEOUT) {
            // Acceptable for timeout scenarios
            assertTrue(true);
        }
    }

    @Test
    void should_maintain_audio_context_across_questions() throws Exception {
        // Given - Audio-related conversation flow
        String[] conversationFlow = {
            "lista los instrumentos disponibles",
            "sube el volumen del piano",
            "¿cuál es el volumen actual?",
            "¿puedes mutear la batería?",
            "¿qué instrumentos están silenciados?"
        };

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // When & Then - Each message should maintain audio context
        for (String message : conversationFlow) {
            String requestBody = "{\"message\":\"" + message + "\"}";
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                baseUrl + "/chat", 
                request, 
                String.class
            );

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            
            // Each response should be audio-related
            String responseBody = response.getBody().toLowerCase();
            assertTrue(responseBody.contains("instrument") || 
                      responseBody.contains("volumen") ||
                      responseBody.contains("piano") ||
                      responseBody.contains("batería") ||
                      responseBody.contains("audio") ||
                      responseBody.contains("sonido"));
        }
    }
}
