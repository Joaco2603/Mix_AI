package com.cenfotec.volumemcp.config;

import com.cenfotec.volumemcp.repository.VolumeRepository;
import org.springframework.ai.support.ToolCallbacks;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

import java.util.List;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(2000); // 2 segundos para conectar
        factory.setReadTimeout(5000);    // 5 segundos para leer respuesta
        return new RestTemplate(factory);
    }
}
