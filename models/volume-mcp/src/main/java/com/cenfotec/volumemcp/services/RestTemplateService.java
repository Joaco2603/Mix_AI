package com.cenfotec.volumemcp.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class RestTemplateService {

    @Autowired
    private RestTemplate restTemplate;

    private final String baseUrl = "http://192.168.0.4/";

    public ResponseEntity<String> setVolume(Integer value, Integer channel) {
        String url = baseUrl + "volume";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("value", value.toString());
        body.add("channel", channel.toString());

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

        return restTemplate.postForEntity(url, requestEntity, String.class);
    }

    public ResponseEntity<String> setMute(Integer channel, Boolean mute) {
        String url = baseUrl + "muteChannel";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("channel", channel.toString());
        body.add("mute", String.valueOf(mute));

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);
        return restTemplate.postForEntity(url, requestEntity, String.class);
    }

    public ResponseEntity<String> setMuteSpeaker(Boolean mute) {
        String url = baseUrl + "muteSpeaker";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("mute", String.valueOf(mute));

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);
        return restTemplate.postForEntity(url, requestEntity, String.class);
    }

    public ResponseEntity<String> getSpeakerStatus() {
        return restTemplate.getForEntity(baseUrl + "speakerStatus/", String.class);
    }

    public ResponseEntity<String> getStatusChannel(Integer channel) {
        return restTemplate.getForEntity(baseUrl + "channelStatus/" + channel, String.class);
    }

    public ResponseEntity<String> changeVolumeSpeaker(Integer value) {
        String url = baseUrl + "changeVolumeSpeaker";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("value", value.toString());

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);
        return restTemplate.postForEntity(url, requestEntity, String.class);
    }

}
