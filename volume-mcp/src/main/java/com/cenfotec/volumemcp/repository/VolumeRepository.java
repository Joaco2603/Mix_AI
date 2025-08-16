package com.cenfotec.volumemcp.repository;

import java.io.FileNotFoundException;
import java.text.Normalizer;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.cenfotec.volumemcp.models.Instrument;
import com.cenfotec.volumemcp.services.RestTemplateService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class VolumeRepository {

    @Autowired
    private RestTemplateService restTemplateService;

    private final List<Instrument> instruments = List.of(
            new Instrument("guitarra", 0),
            new Instrument("voz", 1),
            new Instrument("bajo", 2),
            new Instrument("bateria", 3)
    );

    // Diccionario de sinónimos (normalizados)
    private final Map<String, String> synonyms = Map.of(
            "guitar", "guitarra",
            "drums", "bateria",
            "bass", "bajo",
            "voice", "voz",
            "vocals", "voz"
    );

    @Tool(description = "Gets the list of available instruments")
    public List<String> getAvailableInstruments() {
        return instruments.stream()
                .map(Instrument::getName)
                .collect(Collectors.toList());
    }

    @Tool(description = "Sets the volume of an instrument to a particular value")
    ResponseEntity<String> setVolume(String idInstrument, Integer value) throws FileNotFoundException {
        log.info("Setting {} to volume {}", idInstrument, value);

        // Normalizamos
        String normalized = normalize(idInstrument);

        // Chequear si es un sinónimo y crear variable final
        final String finalNormalized = synonyms.getOrDefault(normalized, normalized);

        Instrument instrument = instruments.stream()
                .filter(instr -> normalize(instr.getName()).equals(finalNormalized))
                .findFirst()
                .orElseThrow(() -> new FileNotFoundException("There is no instrument with id " + idInstrument));

        try {
            ResponseEntity<String> remoteResponse = restTemplateService.setVolume(value, instrument.getChannel());
            if (remoteResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.ok(String.format("Instrument '%s' volume set to %d", instrument.getName(), value));
            } else {
                return ResponseEntity.status(remoteResponse.getStatusCode())
                        .body("Remote service error: " + remoteResponse.getBody());
            }
        } catch (Exception e) {
            log.warn("Could not connect to remote device ({}): {}", "http://194.168.0.4/volume", e.getMessage());
            return ResponseEntity.ok(String.format("Instrument '%s' volume set to %d (simulated - device offline)", instrument.getName(), value));
        }
    }

    private String normalize(String input) {
        if (input == null) {
            return "";
        }
        return Normalizer.normalize(input.trim().toLowerCase(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
    }
}
