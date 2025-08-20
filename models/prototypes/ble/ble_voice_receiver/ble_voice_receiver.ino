#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// UUIDs del Nordic UART Service (estándar reconocido)
#define SERVICE_UUID           "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
#define CHARACTERISTIC_UUID_RX "6e400002-b5a3-f393-e0a9-e50e24dcca9e"
#define CHARACTERISTIC_UUID_TX "6e400003-b5a3-f393-e0a9-e50e24dcca9e"

BLEServer* pServer = NULL;
BLECharacteristic* pTxCharacteristic;
bool deviceConnected = false;
String receivedText = "";

class MyServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println("=== Cliente BLE conectado ===");
  }

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    Serial.println("=== Cliente BLE desconectado ===");
    pServer->startAdvertising(); // Reiniciar advertising inmediatamente
  }
};

class MyCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    String rxValue = pCharacteristic->getValue().c_str();

    if (rxValue.length() > 0) {
      receivedText += rxValue;

      if (receivedText.indexOf('\n') != -1) {
        receivedText.trim();
        
        if (receivedText.length() > 0) {
          Serial.println("----------------------------------------");
          Serial.println("TEXTO DE VOZ RECIBIDO:");
          Serial.println(receivedText);
          Serial.println("----------------------------------------");
        }
        
        receivedText = "";
      }
    }
  }
};

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n=== ESP32 BLE Receptor de Voz ===");
  Serial.println("Iniciando BLE...");

  // Inicializar BLE con nombre más específico
  BLEDevice::init("ESP32-Voice");
  
  // Configurar poder de transmisión al máximo
  BLEDevice::setPower(ESP_PWR_LVL_P9);

  // Crear servidor BLE
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Crear servicio BLE
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Crear característica TX
  pTxCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID_TX,
                      BLECharacteristic::PROPERTY_NOTIFY
                    );
  pTxCharacteristic->addDescriptor(new BLE2902());

  // Crear característica RX
  BLECharacteristic* pRxCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID_RX,
                                         BLECharacteristic::PROPERTY_WRITE
                                       );
  pRxCharacteristic->setCallbacks(new MyCallbacks());

  // Iniciar servicio
  pService->start();

  // Configurar advertising con más opciones
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // Intervalo mínimo
  pAdvertising->setMinPreferred(0x12);  // Intervalo máximo
  
  // Iniciar advertising
  BLEDevice::startAdvertising();
  
  Serial.println("✅ BLE iniciado correctamente");
  Serial.println("📱 Nombre: ESP32-Voice");
  Serial.println("🔍 UUID Servicio: " + String(SERVICE_UUID));
  Serial.println("📡 Advertising activo - Dispositivo visible");
  Serial.println();
}

void loop() {
  delay(1000);
  
  if (!deviceConnected) {
    // Asegurar que advertising esté siempre activo
    static unsigned long lastAdCheck = 0;
    if (millis() - lastAdCheck > 5000) {
      Serial.println("📡 Verificando advertising...");
      BLEDevice::startAdvertising();
      lastAdCheck = millis();
    }
  }
}