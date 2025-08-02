package com.cenfotec.volumemcp.repository;


import com.cenfotec.volumemcp.models.Linea;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class VolumeRepository {

    private final List<Linea> lineas = List.of(
            new Linea("Guitarra", 0.4),
            new Linea("Bajo", 0.3),
            new Linea("Piano", 0.5)
    );


    @Tool(description = "Get all lines. This is used to get the current state of the application")
    List<Linea> getAllInstruments(){
        log.info("Returning all instruments");
        return lineas;
    }


    @Tool(description = "Get all lines which volume exceeds a particular value")
    List<Linea> getAllInstrumentsOverVolume(Double volume){
        log.info("Returning all instruments with volume over " + volume);
        return lineas.stream().filter(linea -> linea.getVolumen() >= volume).toList();
    }

    @Tool(description = "Sets the volume of a line half of it's current value")
    Linea setVolumeToHalf(String idLinea) throws FileNotFoundException {
        log.info("Setting " + idLinea + " volume to half");
        Linea theLinea = lineas.stream().filter(linea -> linea.getNombre().equals(idLinea)).findFirst().orElse(null);
        if(theLinea != null){
            theLinea.setVolumen(theLinea.getVolumen() / 2);
        }else{
            throw new FileNotFoundException("There is no line with the line ID");
        }
        return theLinea;
    }

    @Tool(description = "Sets the volume of a line to a particular value")
    Linea setVolumeToLine(String idLinea, Double newVolume) throws FileNotFoundException {
        Linea theLinea = lineas.stream().filter(linea -> linea.getNombre().equals(idLinea)).findFirst().orElse(null);
        if(theLinea != null){
            log.info("Setting " + idLinea + " to " + newVolume);
            theLinea.setVolumen(newVolume);
        }else{
            throw new FileNotFoundException("There is no line with the line ID " + idLinea);
        }
        return theLinea;
    }

    @Tool(description = "Create a new linea with a particular ID and a particular volume specified by the user")
    Linea createLine(String lineId, double volume){
        log.info("Create new line " + lineId + " with volume " + volume);
        Linea result = new Linea(lineId, volume);
        lineas.add(result);
        return result;
    }
}
