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

    private final String baserUrl = "http://192.168.0.4/";

    public ResponseEntity<String> setVolume(Integer value, Integer channel) {
        String url = baserUrl + "volume";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("value", value.toString());
        body.add("channel", channel.toString());

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

        return restTemplate.postForEntity(url, requestEntity, String.class);
    }
}
