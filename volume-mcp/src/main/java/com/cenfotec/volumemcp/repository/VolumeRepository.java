package com.cenfotec.volumemcp.repository;


import com.cenfotec.volumemcp.models.Instrument;
import com.cenfotec.volumemcp.services.RestTemplateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.util.List;

@Slf4j
@Service
public class VolumeRepository {

    @Autowired
    private RestTemplateService restTemplateService;

    private final List<Instrument> instruments = List.of(
            new Instrument("guitarra", 0),
            new Instrument("voz", 1),
            new Instrument("bateria", 2),
            new Instrument("bajo", 3)
    );

    @Tool(description = "Sets the volume of an instrument to a particular value")
    ResponseEntity<String> setVolume(String idInstrument, Integer value) throws FileNotFoundException {
        log.info("Setting {} to volume {}", idInstrument, value);

        Instrument instrument = instruments.stream()
                .filter(instr -> instr.getName().equals(idInstrument))
                .findFirst()
                .orElseThrow(() -> new FileNotFoundException("There is no instrument with id " + idInstrument));

        ResponseEntity<String> remoteResponse = restTemplateService.setVolume(value, instrument.getChannel());

        if (remoteResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.ok(String.format("Instrument '%s' volume set to %d", idInstrument, value));
        } else {
            return ResponseEntity.status(remoteResponse.getStatusCode())
                    .body("Remote service error: " + remoteResponse.getBody());
        }
    }
}
