package com.cenfotec.volumemcp.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Instrument {
    String name;
    Integer channel;
}
