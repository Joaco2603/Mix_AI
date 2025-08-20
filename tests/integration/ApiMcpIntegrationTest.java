package com.cenfotec.mixia.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
    "firmware.base.url=http://localhost:3001",
    "mcp.base.url=http://localhost:8081",
    "spring.ai.gemini.api-key=test-key-integration"
})
class ApiMcpIntegrationTest {

    @LocalServerPort
    private int apiPort;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private String apiBaseUrl;
    private String mcpBaseUrl;

    @BeforeEach
    void setUp() {
        apiBaseUrl = "http://localhost:" + apiPort;
        mcpBaseUrl = "http://localhost:8081";
    }

    @Test
    void should_process_volume_command_through_mcp_to_firmware() throws Exception {
        // Given
        String chatMessage = "sube el volumen del piano a nivel 8";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String requestBody = "{\"message\":\"" + chatMessage + "\"}";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        // When - API call triggers MCP which calls firmware
        ResponseEntity<String> response = restTemplate.postForEntity(
            apiBaseUrl + "/chat", 
            request, 
            String.class
        );

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        
        // Verify the response indicates successful volume change
        String responseBody = response.getBody().toLowerCase();
        assertTrue(responseBody.contains("piano"));
        assertTrue(responseBody.contains("8") || responseBody.contains("nivel"));
        
        // Verify firmware state was actually changed
        ResponseEntity<String> firmwareStatus = restTemplate.getForEntity(
            "http://localhost:3001/status", 
            String.class
        );
        
        assertEquals(HttpStatus.OK, firmwareStatus.getStatusCode());
        assertTrue(firmwareStatus.getBody().contains("piano"));
    }

    @Test
    void should_handle_mute_command_with_mcp_communication() throws Exception {
        // Given
        String chatMessage = "mutea completamente la batería";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String requestBody = "{\"message\":\"" + chatMessage + "\"}";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        // When
        ResponseEntity<String> response = restTemplate.postForEntity(
            apiBaseUrl + "/chat", 
            request, 
            String.class
        );

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        
        String responseBody = response.getBody().toLowerCase();
        assertTrue(responseBody.contains("batería") || responseBody.contains("bateria"));
        assertTrue(responseBody.contains("mute") || responseBody.contains("silencia"));
    }

    @Test
    void should_handle_multiple_instrument_commands() throws Exception {
        // Given - Complex command affecting multiple instruments
        String chatMessage = "baja el volumen del piano a 3 y sube la guitarra a 9";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String requestBody = "{\"message\":\"" + chatMessage + "\"}";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        // When
        ResponseEntity<String> response = restTemplate.postForEntity(
            apiBaseUrl + "/chat", 
            request, 
            String.class
        );

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        
        String responseBody = response.getBody().toLowerCase();
        assertTrue(responseBody.contains("piano"));
        assertTrue(responseBody.contains("guitarra"));
    }

    @Test
    void should_handle_firmware_unavailable_gracefully() throws Exception {
        // Given - Stop mock firmware server (simulate network issue)
        // This test assumes firmware becomes unavailable
        
        String chatMessage = "sube el volumen del bajo";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String requestBody = "{\"message\":\"" + chatMessage + "\"}";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        // When
        ResponseEntity<String> response = restTemplate.postForEntity(
            apiBaseUrl + "/chat", 
            request, 
            String.class
        );

        // Then - Should handle gracefully, not return 500
        assertTrue(response.getStatusCode().is2xxSuccessful() || 
                  response.getStatusCode() == HttpStatus.SERVICE_UNAVAILABLE);
        
        if (response.getStatusCode().is2xxSuccessful()) {
            // Should indicate connection issue
            String responseBody = response.getBody().toLowerCase();
            assertTrue(responseBody.contains("conexión") || 
                      responseBody.contains("disponible") ||
                      responseBody.contains("error"));
        }
    }

    @Test
    void should_validate_instrument_names_through_mcp() throws Exception {
        // Given - Invalid instrument name
        String chatMessage = "sube el volumen del acordeón";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String requestBody = "{\"message\":\"" + chatMessage + "\"}";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        // When
        ResponseEntity<String> response = restTemplate.postForEntity(
            apiBaseUrl + "/chat", 
            request, 
            String.class
        );

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        
        // Should indicate instrument not available
        String responseBody = response.getBody().toLowerCase();
        assertTrue(responseBody.contains("no disponible") || 
                  responseBody.contains("no encontrado") ||
                  responseBody.contains("instrumentos disponibles"));
    }

    @Test
    void should_handle_concurrent_requests() throws Exception {
        // Given - Multiple simultaneous requests
        String[] commands = {
            "sube el volumen del piano",
            "mutea la guitarra", 
            "baja el volumen de la batería",
            "lista los instrumentos"
        };

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // When - Send requests concurrently
        ResponseEntity<String>[] responses = new ResponseEntity[commands.length];
        Thread[] threads = new Thread[commands.length];

        for (int i = 0; i < commands.length; i++) {
            final int index = i;
            threads[i] = new Thread(() -> {
                String requestBody = "{\"message\":\"" + commands[index] + "\"}";
                HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
                
                responses[index] = restTemplate.postForEntity(
                    apiBaseUrl + "/chat", 
                    request, 
                    String.class
                );
            });
            threads[i].start();
        }

        // Wait for all threads
        for (Thread thread : threads) {
            thread.join();
        }

        // Then - All requests should succeed
        for (ResponseEntity<String> response : responses) {
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
        }
    }

    @Test
    void should_maintain_session_state_across_requests() throws Exception {
        // Given - First command to set volume
        String firstCommand = "sube el volumen del piano a 8";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String requestBody1 = "{\"message\":\"" + firstCommand + "\"}";
        HttpEntity<String> request1 = new HttpEntity<>(requestBody1, headers);

        // When - First request
        ResponseEntity<String> response1 = restTemplate.postForEntity(
            apiBaseUrl + "/chat", 
            request1, 
            String.class
        );

        // Then - Should succeed
        assertEquals(HttpStatus.OK, response1.getStatusCode());

        // Given - Second command referring to previous state
        String secondCommand = "¿cuál es el volumen actual del piano?";
        String requestBody2 = "{\"message\":\"" + secondCommand + "\"}";
        HttpEntity<String> request2 = new HttpEntity<>(requestBody2, headers);

        // When - Second request
        ResponseEntity<String> response2 = restTemplate.postForEntity(
            apiBaseUrl + "/chat", 
            request2, 
            String.class
        );

        // Then - Should know the current state
        assertEquals(HttpStatus.OK, response2.getStatusCode());
        String responseBody = response2.getBody().toLowerCase();
        assertTrue(responseBody.contains("piano"));
    }
}
