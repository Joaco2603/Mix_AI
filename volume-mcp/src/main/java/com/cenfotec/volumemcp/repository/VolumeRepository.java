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

    /*** Helpers ***/
    private final List<Instrument> instruments = List.of(
            new Instrument("guitarra", 0, false),
            new Instrument("voz", 1, false),
            new Instrument("bajo", 2, false),
            new Instrument("bateria", 3, false)
    );

    private final Map<String, String> synonyms = Map.of(
            "guitar", "guitarra",
            "drums", "bateria",
            "bass", "bajo",
            "voice", "voz",
            "vocals", "voz"
    );

    private String normalize(String input) {
        if (input == null) return "";
        return Normalizer.normalize(input.trim().toLowerCase(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
    }

    private Instrument findInstrumentByName(String idInstrument) throws FileNotFoundException {
        String normalized = normalize(idInstrument);
        String finalNormalized = synonyms.getOrDefault(normalized, normalized);

        return instruments.stream()
                .filter(instr -> normalize(instr.getName()).equals(finalNormalized))
                .findFirst()
                .orElseThrow(() -> new FileNotFoundException("No instrument with id " + idInstrument));
    }

    /*** Tools ***/
    @Tool(description = "Gets the list of available instruments")
    public List<String> getAvailableInstruments() {
        return instruments.stream()
                .map(Instrument::getName)
                .collect(Collectors.toList());
    }

    @Tool(description = "Sets the volume of a specific with name of the instrument.")
    ResponseEntity<String> setVolume(String idInstrument, Integer value) throws FileNotFoundException {
        Instrument instrument = findInstrumentByName(idInstrument);
        log.info("Setting {} to volume {}", instrument.getName(), value);

        try {
            ResponseEntity<String> response = restTemplateService.setVolume(value, instrument.getChannel());
            if (response.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.ok(String.format("Instrument '%s' volume set to %d", instrument.getName(), value));
            } else {
                return ResponseEntity.status(response.getStatusCode())
                        .body("Remote service error: " + response.getBody());
            }
        } catch (Exception e) {
            log.warn("Could not connect to remote device: {}", e.getMessage());
            return ResponseEntity.ok(String.format("Instrument '%s' volume set to %d (simulated - device offline)", instrument.getName(), value));
        }
    }

    @Tool(description = "Mutes or unmutes a specific audio channel with name of the instrument.")
    ResponseEntity<String> setMute(String idInstrument, Boolean mute) throws FileNotFoundException {
        Instrument instrument = findInstrumentByName(idInstrument);
        log.info("Setting mute={} for instrument={} channel={}", mute, instrument.getName(), instrument.getChannel());

        try {
            ResponseEntity<String> response = restTemplateService.setMute(instrument.getChannel(), mute);
            if (response.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.ok(String.format("Channel '%s' mute set to %s", instrument.getChannel(), mute));
            } else {
                return ResponseEntity.status(response.getStatusCode())
                        .body("Remote service error: " + response.getBody());
            }
        } catch (Exception e) {
            log.warn("Could not connect to remote device: {}", e.getMessage());
            return ResponseEntity.ok(String.format("Channel '%s' mute set to %s (simulated - device offline)", instrument.getChannel(), mute));
        }
    }

    @Tool(description = "Mutes and unmutes all speaker channels at once. This tool silences or unmutes every available channel simultaneously and does not require specifying a channel number.")
    ResponseEntity<String> setMuteSpeaker(Boolean mute) {
        log.info("Muting all speaker channels at once");

        try {
            ResponseEntity<String> response = restTemplateService.setMuteSpeaker(mute);
            if (response.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.ok("Muted all available channels");
            } else {
                return ResponseEntity.status(response.getStatusCode())
                        .body("Remote service error: " + response.getBody());
            }
        } catch (Exception e) {
            log.warn("Could not connect to remote device: {}", e.getMessage());
            return ResponseEntity.ok("Set all channels to mute (simulated - device offline)");
        }
    }

    @Tool(description = "Gets the current overall volume of the speaker. This tool does not require any additional input and will return the speaker's current volume level.")
    ResponseEntity<String> getSpeakerStatus() {
        log.info("Getting speaker status");
        try {
            ResponseEntity<String> response = restTemplateService.getSpeakerStatus();

            if (response.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.ok(response.getBody());
            } else {
                return ResponseEntity.status(response.getStatusCode())
                        .body("Remote service error: " + response.getBody());
            }
        } catch (Exception e) {
            log.warn("Could not connect to remote device: {}", e.getMessage());
            return ResponseEntity.ok("Get the current value of the speaker (simulated - device offline)");
        }
    }

    @Tool(description = "Gets the current volume of a specific channel with the name of the channe.")
    ResponseEntity<String> getStatusChannel(String idInstrument) throws FileNotFoundException {
        Instrument instrument = findInstrumentByName(idInstrument);
        log.info("Getting status of instrument={} channel={}", instrument.getName(), instrument.getChannel());

        try {
            ResponseEntity<String> response = restTemplateService.getStatusChannel(instrument.getChannel());
            if (response.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.ok(response.getBody());
            } else {
                return ResponseEntity.status(response.getStatusCode())
                        .body("Remote service error: " + response.getBody());
            }
        } catch (Exception e) {
            log.warn("Could not connect to remote device: {}", e.getMessage());
            return ResponseEntity.ok(String.format( "Get channel '%s' values (simulated - device offline)",  instrument.getChannel()));
        }
    }
}
