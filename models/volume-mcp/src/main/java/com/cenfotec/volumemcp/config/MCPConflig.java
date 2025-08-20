package com.cenfotec.volumemcp.config;

import com.cenfotec.volumemcp.repository.VolumeRepository;
import org.springframework.ai.support.ToolCallbacks;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class MCPConflig {

    @Bean
    List<ToolCallback> volumeTools(VolumeRepository volumeRepository){
        return List.of(ToolCallbacks.from(volumeRepository));
    }

}
