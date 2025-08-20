let bluetoothDevice = null;
let txCharacteristic = null;
let rxCharacteristic = null;
let recognition = null;
let isListening = false;

const connectBtn = document.getElementById('connectBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const bluetoothStatus = document.getElementById('bluetoothStatus');
const transcript = document.getElementById('transcript');
const voiceIndicator = document.getElementById('voiceIndicator');
const log = document.getElementById('log');

// Configuración del servicio BLE (Nordic UART Service)
const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const TX_CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // TX (ESP32 recibe)
const RX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; // RX (ESP32 envía)

function addLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    log.innerHTML += `> [${timestamp}] ${message}<br>`;
    log.scrollTop = log.scrollHeight;
}

// Conectar vía BLE
connectBtn.addEventListener('click', async () => {
    try {
        addLog('Buscando dispositivos BLE...');

        bluetoothDevice = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [SERVICE_UUID]
        });

        addLog(`Conectando a: ${bluetoothDevice.name || 'Dispositivo BLE'}`);

        const server = await bluetoothDevice.gatt.connect();
        const service = await server.getPrimaryService(SERVICE_UUID);

        // Obtener características TX y RX
        txCharacteristic = await service.getCharacteristic(TX_CHARACTERISTIC_UUID);

        try {
            rxCharacteristic = await service.getCharacteristic(RX_CHARACTERISTIC_UUID);
            // Configurar notificaciones para recibir datos del ESP32
            if (rxCharacteristic.properties.notify) {
                await rxCharacteristic.startNotifications();
                rxCharacteristic.addEventListener('characteristicvaluechanged', handleNotification);
                addLog('Notificaciones BLE activadas');
            }
        } catch (e) {
            addLog('Característica RX no disponible (opcional)');
        }

        bluetoothStatus.className = 'status connected';
        bluetoothStatus.innerHTML = '🟢 BLE Conectado a ' + (bluetoothDevice.name || 'ESP32');

        connectBtn.disabled = true;
        startBtn.disabled = false;

        addLog('Conexión BLE establecida exitosamente');

        // Manejar desconexión
        bluetoothDevice.addEventListener('gattserverdisconnected', () => {
            bluetoothStatus.className = 'status disconnected';
            bluetoothStatus.innerHTML = '🔴 BLE Desconectado';
            connectBtn.disabled = false;
            startBtn.disabled = true;
            stopBtn.disabled = true;
            txCharacteristic = null;
            rxCharacteristic = null;
            addLog('Dispositivo BLE desconectado');
        });

    } catch (error) {
        addLog(`Error de conexión BLE: ${error.message}`);
        console.error('Error:', error);
    }
});

// Inicializar reconocimiento de voz
function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        addLog('Error: Reconocimiento de voz no soportado en este navegador');
        return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';

    recognition.onstart = () => {
        isListening = true;
        transcript.className = 'transcript-area listening';
        voiceIndicator.className = 'voice-indicator listening';
        startBtn.disabled = true;
        stopBtn.disabled = false;
        addLog('Reconocimiento de voz iniciado - Escuchando...');
    };

    recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcriptPart;
            } else {
                interimTranscript += transcriptPart;
            }
        }

        transcript.innerHTML = finalTranscript + '<span style="color: #666;">' + interimTranscript + '</span>';

        // Enviar texto final al ESP32
        if (finalTranscript && txCharacteristic) {
            sendToESP32(finalTranscript.trim());
        }
    };

    recognition.onerror = (event) => {
        addLog(`Error de reconocimiento: ${event.error}`);
    };

    recognition.onend = () => {
        isListening = false;
        transcript.className = 'transcript-area';
        voiceIndicator.className = 'voice-indicator';
        startBtn.disabled = false;
        stopBtn.disabled = true;
        addLog('Reconocimiento de voz detenido');
    };

    return true;
}

// Manejar notificaciones del ESP32
function handleNotification(event) {
    const decoder = new TextDecoder();
    const data = decoder.decode(event.target.value);
    addLog(`Recibido del ESP32: "${data.trim()}"`);
}

// Enviar datos al ESP32 via BLE
async function sendToESP32(text) {
    if (!txCharacteristic) {
        addLog('Error: No hay conexión BLE activa');
        return;
    }

    try {
        // BLE tiene límites de paquete, dividir texto si es necesario
        const maxChunkSize = 20; // Tamaño típico de MTU para BLE
        const chunks = [];

        for (let i = 0; i < text.length; i += maxChunkSize) {
            chunks.push(text.slice(i, i + maxChunkSize));
        }

        for (const chunk of chunks) {
            const encoder = new TextEncoder();
            const data = encoder.encode(chunk);
            await txCharacteristic.writeValue(data);

            // Pequeña pausa entre paquetes
            if (chunks.length > 1) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }

        // Enviar terminador
        const encoder = new TextEncoder();
        const terminator = encoder.encode('\n');
        await txCharacteristic.writeValue(terminator);

        addLog(`Enviado al ESP32 via BLE: "${text}"`);
    } catch (error) {
        addLog(`Error enviando datos BLE: ${error.message}`);
    }
}

// Iniciar reconocimiento
startBtn.addEventListener('click', () => {
    if (!recognition && !initSpeechRecognition()) {
        return;
    }

    transcript.innerHTML = 'Escuchando... Habla ahora';
    recognition.start();
});

// Detener reconocimiento
stopBtn.addEventListener('click', () => {
    if (recognition && isListening) {
        recognition.stop();
    }
});

// Verificar soporte de BLE al cargar
window.addEventListener('load', () => {
    if (!navigator.bluetooth) {
        addLog('Error: Web Bluetooth API no soportada en este navegador');
        connectBtn.disabled = true;
        connectBtn.innerHTML = '❌ BLE No Soportado';
    } else {
        addLog('Web Bluetooth API (BLE) disponible');
    }

    // Inicializar reconocimiento de voz
    if (initSpeechRecognition()) {
        addLog('Reconocimiento de voz inicializado');
    }
});