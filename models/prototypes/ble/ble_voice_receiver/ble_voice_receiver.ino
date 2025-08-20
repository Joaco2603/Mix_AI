/*
  ESP32 BLE - Receptor de voz (Nordic UART Service)

  Este sketch crea un servidor BLE que implementa el servicio NUS (Nordic UART)
  para recibir texto desde una interfaz web que use Web Bluetooth + Web Speech API.

  Buenas prácticas aplicadas:
  - UUIDs estándar para NUS definidos en macros.
  - Callbacks separados para eventos de servidor y escritura en la característica.
  - Buffer incremental para manejar líneas largas (concatenación hasta encontrar '\n').
  - Mensajes claros por Serial para depuración.

  Requisitos:
  - Biblioteca ESP32 BLE Arduino (nkolban/ESP32_BLE_Arduino)

  Uso:
  - Compila y sube al ESP32.
  - Abre la web que implemente Web Bluetooth + Web Speech y conecta al servicio.
  - Envía texto; cuando se reciba una nueva línea, se imprimirá por Serial.
*/

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// UUIDs del Nordic UART Service (estándar reconocido)
#define SERVICE_UUID           "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
#define CHARACTERISTIC_UUID_RX "6e400002-b5a3-f393-e0a9-e50e24dcca9e"
#define CHARACTERISTIC_UUID_TX "6e400003-b5a3-f393-e0a9-e50e24dcca9e"

// Objetos BLE globales
BLEServer* pServer = NULL;
BLECharacteristic* pTxCharacteristic;
bool deviceConnected = false;
String receivedText = ""; // buffer para acumular datos hasta encontrar '\n'

// Callbacks del servidor BLE: notifica conect/disconect
class MyServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println("=== Cliente BLE conectado ===");
  }

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    Serial.println("=== Cliente BLE desconectado ===");
    // Reiniciamos el advertising inmediatamente para volver a ser detectables
    pServer->startAdvertising();
  }
};

// Callbacks para la característica RX: se llama cuando el cliente escribe datos
class MyCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    // Obtener el contenido enviado por el cliente
    String rxValue = pCharacteristic->getValue().c_str();

    if (rxValue.length() > 0) {
      // Acumulamos en el buffer hasta recibir una nueva línea
      receivedText += rxValue;

      // Si encontramos un salto de línea, procesamos la línea completa
      if (receivedText.indexOf('\n') != -1) {
        receivedText.trim();

        if (receivedText.length() > 0) {
          Serial.println("----------------------------------------");
          Serial.println("TEXTO DE VOZ RECIBIDO:");
          Serial.println(receivedText);
          Serial.println("----------------------------------------");
        }

        // Limpiar buffer para la siguiente línea
        receivedText = "";
      }
    }
  }
};

// Inicialización del dispositivo y servicios BLE
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n=== ESP32 BLE Receptor de Voz ===");
  Serial.println("Iniciando BLE...");

  // Inicializar BLE con nombre identificable (puede modificarse)
  BLEDevice::init("ESP32-Voice");

  // Opcional: configurar potencia de transmisión (si el board lo soporta)
  BLEDevice::setPower(ESP_PWR_LVL_P9);

  // Crear servidor y asignar callbacks
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Crear servicio y características NUS (TX = notify, RX = write)
  BLEService *pService = pServer->createService(SERVICE_UUID);

  pTxCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID_TX,
                      BLECharacteristic::PROPERTY_NOTIFY
                    );
  pTxCharacteristic->addDescriptor(new BLE2902());

  BLECharacteristic* pRxCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID_RX,
                                         BLECharacteristic::PROPERTY_WRITE
                                       );
  pRxCharacteristic->setCallbacks(new MyCallbacks());

  // Iniciar servicio y advertising
  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // Intervalos recomendados
  pAdvertising->setMinPreferred(0x12);

  BLEDevice::startAdvertising();

  Serial.println("✅ BLE iniciado correctamente");
  Serial.println("📱 Nombre: ESP32-Voice");
  Serial.println("🔍 UUID Servicio: " + String(SERVICE_UUID));
  Serial.println("📡 Advertising activo - Dispositivo visible");
  Serial.println();
}

// Bucle principal: mantiene alive el advertising y realiza checks periódicos
void loop() {
  delay(1000);

  if (!deviceConnected) {
    // Si no hay cliente conectado forzamos el advertising cada cierto tiempo
    static unsigned long lastAdCheck = 0;
    if (millis() - lastAdCheck > 5000) {
      Serial.println("📡 Verificando advertising...");
      BLEDevice::startAdvertising();
      lastAdCheck = millis();
    }
  }
}