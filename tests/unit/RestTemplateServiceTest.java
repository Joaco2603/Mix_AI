package com.cenfotec.volumemcp.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RestTemplateServiceTest {

    @Mock
    private RestTemplate restTemplate;

    private RestTemplateService restTemplateService;
    private final String baseUrl = "http://192.168.0.4";

    @BeforeEach
    void setUp() {
        restTemplateService = new RestTemplateService();
        // Inject mock via reflection or setter if available
        // restTemplateService.setRestTemplate(restTemplate);
    }

    @Test
    void should_set_volume_successfully() {
        // Given
        String instrument = "piano";
        int volume = 7;
        String expectedUrl = baseUrl + "/setVolume";
        String expectedResponse = "Volume set successfully";
        
        when(restTemplate.postForObject(eq(expectedUrl), any(), eq(String.class)))
            .thenReturn(expectedResponse);

        // When
        String result = restTemplateService.setVolume(instrument, volume);

        // Then
        assertEquals(expectedResponse, result);
        verify(restTemplate, times(1)).postForObject(eq(expectedUrl), any(), eq(String.class));
    }

    @Test
    void should_mute_channel_successfully() {
        // Given
        String instrument = "bateria";
        String expectedUrl = baseUrl + "/muteChannel";
        String expectedResponse = "Channel muted successfully";
        
        when(restTemplate.postForObject(eq(expectedUrl), any(), eq(String.class)))
            .thenReturn(expectedResponse);

        // When
        String result = restTemplateService.muteChannel(instrument);

        // Then
        assertEquals(expectedResponse, result);
        verify(restTemplate, times(1)).postForObject(eq(expectedUrl), any(), eq(String.class));
    }

    @Test
    void should_handle_network_error_on_set_volume() {
        // Given
        String instrument = "guitarra";
        int volume = 5;
        String expectedUrl = baseUrl + "/setVolume";
        
        when(restTemplate.postForObject(eq(expectedUrl), any(), eq(String.class)))
            .thenThrow(new RestClientException("Connection refused"));

        // When & Then
        assertThrows(RestClientException.class, () -> {
            restTemplateService.setVolume(instrument, volume);
        });
    }

    @Test
    void should_handle_network_error_on_mute_channel() {
        // Given
        String instrument = "bajo";
        String expectedUrl = baseUrl + "/muteChannel";
        
        when(restTemplate.postForObject(eq(expectedUrl), any(), eq(String.class)))
            .thenThrow(new RestClientException("Timeout"));

        // When & Then
        assertThrows(RestClientException.class, () -> {
            restTemplateService.muteChannel(instrument);
        });
    }

    @Test
    void should_validate_volume_range() {
        // Given
        String instrument = "piano";
        
        // When & Then - Volume too low
        assertThrows(IllegalArgumentException.class, () -> {
            restTemplateService.setVolume(instrument, -1);
        });
        
        // When & Then - Volume too high
        assertThrows(IllegalArgumentException.class, () -> {
            restTemplateService.setVolume(instrument, 11);
        });
    }

    @Test
    void should_validate_instrument_name() {
        // When & Then - Null instrument
        assertThrows(IllegalArgumentException.class, () -> {
            restTemplateService.setVolume(null, 5);
        });
        
        // When & Then - Empty instrument
        assertThrows(IllegalArgumentException.class, () -> {
            restTemplateService.setVolume("", 5);
        });
        
        // When & Then - Null instrument for mute
        assertThrows(IllegalArgumentException.class, () -> {
            restTemplateService.muteChannel(null);
        });
    }

    @Test
    void should_get_mixer_status() {
        // Given
        String expectedUrl = baseUrl + "/status";
        String expectedResponse = "{\"piano\":7,\"guitarra\":5,\"bateria\":8}";
        
        when(restTemplate.getForObject(expectedUrl, String.class))
            .thenReturn(expectedResponse);

        // When
        String result = restTemplateService.getMixerStatus();

        // Then
        assertEquals(expectedResponse, result);
        verify(restTemplate, times(1)).getForObject(expectedUrl, String.class);
    }
}
