package com.cenfotec.mixia.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
    "firmware.base.url=http://localhost:3001",
    "spring.ai.gemini.api-key=test-key"
})
class FullStackIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private String baseUrl;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port;
    }

    @Test
    void should_process_complete_chat_flow() throws Exception {
        // Given
        String chatMessage = "sube el volumen del piano a 8";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String requestBody = "{\"message\":\"" + chatMessage + "\"}";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        // When
        ResponseEntity<String> response = restTemplate.postForEntity(
            baseUrl + "/chat", 
            request, 
            String.class
        );

        // Then
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("piano"));
    }

    @Test
    void should_handle_mute_command_flow() throws Exception {
        // Given
        String chatMessage = "mutea la batería";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String requestBody = "{\"message\":\"" + chatMessage + "\"}";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        // When
        ResponseEntity<String> response = restTemplate.postForEntity(
            baseUrl + "/chat", 
            request, 
            String.class
        );

        // Then
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("batería") || response.getBody().contains("bateria"));
    }

    @Test
    void should_handle_list_instruments_command() throws Exception {
        // Given
        String chatMessage = "lista los instrumentos disponibles";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String requestBody = "{\"message\":\"" + chatMessage + "\"}";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        // When
        ResponseEntity<String> response = restTemplate.postForEntity(
            baseUrl + "/chat", 
            request, 
            String.class
        );

        // Then
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        // Should contain list of instruments
        String responseBody = response.getBody().toLowerCase();
        assertTrue(responseBody.contains("piano") || 
                  responseBody.contains("guitarra") || 
                  responseBody.contains("batería"));
    }

    @Test
    void should_reject_non_audio_questions() throws Exception {
        // Given
        String chatMessage = "¿cuál es la capital de Francia?";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String requestBody = "{\"message\":\"" + chatMessage + "\"}";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        // When
        ResponseEntity<String> response = restTemplate.postForEntity(
            baseUrl + "/chat", 
            request, 
            String.class
        );

        // Then
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        // Should indicate it only handles audio commands
        String responseBody = response.getBody().toLowerCase();
        assertTrue(responseBody.contains("audio") || 
                  responseBody.contains("música") || 
                  responseBody.contains("sonido"));
    }

    @Test
    void should_handle_malformed_requests() throws Exception {
        // Given
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String requestBody = "{\"invalid\":\"request\"}";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        // When
        ResponseEntity<String> response = restTemplate.postForEntity(
            baseUrl + "/chat", 
            request, 
            String.class
        );

        // Then
        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void should_handle_empty_message() throws Exception {
        // Given
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String requestBody = "{\"message\":\"\"}";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        // When
        ResponseEntity<String> response = restTemplate.postForEntity(
            baseUrl + "/chat", 
            request, 
            String.class
        );

        // Then
        assertEquals(400, response.getStatusCodeValue());
    }
}
