const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Estado simulado del mixer
let mixerState = {
  piano: { volume: 5, muted: false },
  guitarra: { volume: 6, muted: false },
  bateria: { volume: 7, muted: false },
  bajo: { volume: 4, muted: false },
  voz: { volume: 8, muted: false }
};

// Logs de requests para debugging
const logRequest = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, req.body);
  next();
};

app.use(logRequest);

// Endpoint: Set Volume
app.post('/setVolume', (req, res) => {
  const { instrument, volume } = req.body;
  
  // Validaciones
  if (!instrument || volume === undefined) {
    return res.status(400).json({ 
      error: 'Missing instrument or volume parameter' 
    });
  }
  
  if (volume < 0 || volume > 10) {
    return res.status(400).json({ 
      error: 'Volume must be between 0 and 10' 
    });
  }
  
  if (!mixerState[instrument]) {
    return res.status(404).json({ 
      error: `Instrument '${instrument}' not found` 
    });
  }
  
  // Actualizar estado
  mixerState[instrument].volume = volume;
  mixerState[instrument].muted = false; // Unmute al cambiar volumen
  
  console.log(`Volume set: ${instrument} = ${volume}`);
  
  res.json({
    message: `Volume set successfully for ${instrument}`,
    instrument,
    volume,
    state: mixerState[instrument]
  });
});

// Endpoint: Mute Channel
app.post('/muteChannel', (req, res) => {
  const { instrument } = req.body;
  
  if (!instrument) {
    return res.status(400).json({ 
      error: 'Missing instrument parameter' 
    });
  }
  
  if (!mixerState[instrument]) {
    return res.status(404).json({ 
      error: `Instrument '${instrument}' not found` 
    });
  }
  
  // Toggle mute
  mixerState[instrument].muted = !mixerState[instrument].muted;
  
  console.log(`Mute toggled: ${instrument} = ${mixerState[instrument].muted}`);
  
  res.json({
    message: `${instrument} ${mixerState[instrument].muted ? 'muted' : 'unmuted'}`,
    instrument,
    muted: mixerState[instrument].muted,
    state: mixerState[instrument]
  });
});

// Endpoint: Get Status
app.get('/status', (req, res) => {
  res.json({
    mixer: mixerState,
    timestamp: new Date().toISOString(),
    firmware_version: "mock-1.0.0"
  });
});

// Endpoint: Reset Mixer
app.post('/reset', (req, res) => {
  mixerState = {
    piano: { volume: 5, muted: false },
    guitarra: { volume: 5, muted: false },
    bateria: { volume: 5, muted: false },
    bajo: { volume: 5, muted: false },
    voz: { volume: 5, muted: false }
  };
  
  console.log('Mixer reset to default values');
  
  res.json({
    message: 'Mixer reset successfully',
    state: mixerState
  });
});

// Endpoint: Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Mock Firmware Server running on http://localhost:${PORT}`);
  console.log(`Initial mixer state:`, mixerState);
  console.log('\nAvailable endpoints:');
  console.log('  POST /setVolume     - Set instrument volume');
  console.log('  POST /muteChannel   - Toggle instrument mute');
  console.log('  GET  /status        - Get mixer status');
  console.log('  POST /reset         - Reset mixer to defaults');
  console.log('  GET  /health        - Health check');
});

module.exports = app;
