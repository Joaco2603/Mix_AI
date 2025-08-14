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

    private final String baserUrl = "http://194.168.0.4/";

    public ResponseEntity<String> setVolume(Integer value, Integer channel) {
        String url = baserUrl + "volume";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("value", value);
        body.add("channel", channel);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        return restTemplate.postForEntity(url, requestEntity, String.class);
    }
}
