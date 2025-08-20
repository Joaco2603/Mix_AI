package com.cenfotec.mixia.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.TestPropertySource;

import java.util.Map;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
    "firmware.base.url=http://localhost:3001"
})
class McpFirmwareIntegrationTest {

    @LocalServerPort
    private int mcpPort;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private String mcpBaseUrl;
    private String firmwareBaseUrl;

    @BeforeEach
    void setUp() {
        mcpBaseUrl = "http://localhost:" + mcpPort;
        firmwareBaseUrl = "http://localhost:3001";
        
        // Reset firmware state before each test
        resetFirmwareState();
    }

    private void resetFirmwareState() {
        try {
            restTemplate.postForEntity(firmwareBaseUrl + "/reset", null, String.class);
            TimeUnit.MILLISECONDS.sleep(100); // Brief delay for state reset
        } catch (Exception e) {
            // Ignore if firmware not available
        }
    }

    @Test
    void should_set_volume_directly_on_firmware() throws Exception {
        // Given
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> volumeRequest = Map.of(
            "instrument", "piano",
            "volume", 7
        );
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(volumeRequest, headers);

        // When - Direct MCP to firmware call
        ResponseEntity<String> response = restTemplate.postForEntity(
            mcpBaseUrl + "/setVolume", 
            request, 
            String.class
        );

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        
        // Verify firmware received the command
        ResponseEntity<String> firmwareStatus = restTemplate.getForEntity(
            firmwareBaseUrl + "/status", 
            String.class
        );
        
        assertTrue(firmwareStatus.getBody().contains("\"piano\""));
        assertTrue(firmwareStatus.getBody().contains("\"volume\":7"));
    }

    @Test
    void should_mute_channel_directly_on_firmware() throws Exception {
        // Given
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> muteRequest = Map.of(
            "instrument", "guitarra"
        );
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(muteRequest, headers);

        // When
        ResponseEntity<String> response = restTemplate.postForEntity(
            mcpBaseUrl + "/muteChannel", 
            request, 
            String.class
        );

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        
        // Verify firmware state changed
        ResponseEntity<String> firmwareStatus = restTemplate.getForEntity(
            firmwareBaseUrl + "/status", 
            String.class
        );
        
        assertTrue(firmwareStatus.getBody().contains("\"guitarra\""));
        assertTrue(firmwareStatus.getBody().contains("\"muted\":true"));
    }

    @Test
    void should_handle_invalid_volume_range() throws Exception {
        // Given - Volume out of range
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> invalidVolumeRequest = Map.of(
            "instrument", "piano",
            "volume", 15  // Invalid: > 10
        );
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(invalidVolumeRequest, headers);

        // When
        ResponseEntity<String> response = restTemplate.postForEntity(
            mcpBaseUrl + "/setVolume", 
            request, 
            String.class
        );

        // Then - Should reject invalid volume
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void should_handle_unknown_instrument() throws Exception {
        // Given
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> unknownInstrumentRequest = Map.of(
            "instrument", "trompeta",  // Not in available instruments
            "volume", 5
        );
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(unknownInstrumentRequest, headers);

        // When
        ResponseEntity<String> response = restTemplate.postForEntity(
            mcpBaseUrl + "/setVolume", 
            request, 
            String.class
        );

        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void should_retrieve_current_mixer_status() throws Exception {
        // Given - Set some volumes first
        setVolumeOnFirmware("piano", 6);
        setVolumeOnFirmware("guitarra", 8);
        muteChannelOnFirmware("bateria");

        // When - Get status through MCP
        ResponseEntity<String> response = restTemplate.getForEntity(
            mcpBaseUrl + "/status", 
            String.class
        );

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        
        String statusBody = response.getBody();
        assertTrue(statusBody.contains("piano"));
        assertTrue(statusBody.contains("guitarra"));
        assertTrue(statusBody.contains("bateria"));
    }

    @Test
    void should_handle_firmware_timeout() throws Exception {
        // Given - This test simulates firmware being slow/unresponsive
        // We'll use a non-existent endpoint to simulate timeout
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> request = Map.of(
            "instrument", "piano",
            "volume", 5
        );
        
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(request, headers);

        // When - Try to connect to non-existent firmware
        // This should be tested with actual timeout configuration
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:9999/setVolume",  // Non-existent port
                requestEntity, 
                String.class
            );
            
            // Should not reach here
            fail("Expected timeout exception");
            
        } catch (Exception e) {
            // Then - Should handle gracefully
            assertTrue(e.getMessage().contains("Connection refused") || 
                      e.getMessage().contains("timeout"));
        }
    }

    @Test
    void should_maintain_firmware_state_consistency() throws Exception {
        // Given - Set initial state
        setVolumeOnFirmware("piano", 5);
        setVolumeOnFirmware("guitarra", 7);
        
        // When - Multiple operations
        setVolumeOnFirmware("piano", 8);
        muteChannelOnFirmware("guitarra");
        setVolumeOnFirmware("bateria", 6);

        // Then - Check final state is consistent
        ResponseEntity<String> finalStatus = restTemplate.getForEntity(
            firmwareBaseUrl + "/status", 
            String.class
        );
        
        String statusBody = finalStatus.getBody();
        
        // Piano should be 8
        assertTrue(statusBody.contains("\"piano\"") && statusBody.contains("\"volume\":8"));
        
        // Guitarra should be muted
        assertTrue(statusBody.contains("\"guitarra\"") && statusBody.contains("\"muted\":true"));
        
        // Bateria should be 6
        assertTrue(statusBody.contains("\"bateria\"") && statusBody.contains("\"volume\":6"));
    }

    @Test
    void should_handle_rapid_sequential_commands() throws Exception {
        // Given - Rapid sequence of commands
        String[] instruments = {"piano", "guitarra", "bateria", "bajo", "voz"};
        
        // When - Send rapid commands
        for (int i = 0; i < instruments.length; i++) {
            setVolumeOnFirmware(instruments[i], i + 3);
            // No delay between commands to test rapid execution
        }

        // Then - All commands should be processed
        ResponseEntity<String> finalStatus = restTemplate.getForEntity(
            firmwareBaseUrl + "/status", 
            String.class
        );
        
        String statusBody = finalStatus.getBody();
        
        for (int i = 0; i < instruments.length; i++) {
            assertTrue(statusBody.contains("\"" + instruments[i] + "\""));
            assertTrue(statusBody.contains("\"volume\":" + (i + 3)));
        }
    }

    // Helper methods
    private void setVolumeOnFirmware(String instrument, int volume) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> request = Map.of(
            "instrument", instrument,
            "volume", volume
        );
        
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(request, headers);
        
        restTemplate.postForEntity(
            mcpBaseUrl + "/setVolume", 
            requestEntity, 
            String.class
        );
    }

    private void muteChannelOnFirmware(String instrument) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> request = Map.of("instrument", instrument);
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(request, headers);
        
        restTemplate.postForEntity(
            mcpBaseUrl + "/muteChannel", 
            requestEntity, 
            String.class
        );
    }
}
