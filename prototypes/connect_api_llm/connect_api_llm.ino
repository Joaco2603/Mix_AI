#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include <WiFiClientSecure.h>
#include "secrets.h"
const char* ssid = SECRET_SSID;
const char* password =  SECRET_PASS;
 
String escapeJSONString(String s) {
  s.replace("\\", "\\\\");
  s.replace("\"", "\\\"");
  s.replace("/", "\\/");
  s.replace("\b", "\\b");
  s.replace("\f", "\\f");
  s.replace("\n", "\\n");
  s.replace("\r", "\\r");
  s.replace("\t", "\\t");
  return s;
}

HTTPClient http;

void setup() {
 
  Serial.begin(115200);
  delay(4000);   // Delay needed before calling the WiFi.begin
 
  WiFi.begin(ssid, password); 
 
  while (WiFi.status() != WL_CONNECTED) { // Check for the connection
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
 
  Serial.println("Connected to the WiFi network");
}

void loop() {
  while(Serial.available() == 0){}

  String input = Serial.readString();
  input.trim();
  input = escapeJSONString(input);

  // Construir el JSON manualmente
  String payload = "{";
  payload += "\"contents\": [ { \"parts\": [ { \"text\": \"" + input + "\" } ] } ]";
  payload += "}";

  Serial.println("Enviando payload: " + payload);

  if(WiFi.status()== WL_CONNECTED){   // Check WiFi connection status   
  
   String url = String("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=") + API_KEY;
   http.begin(url);

   http.setTimeout(15000);  // Wait up to 15 sec if the server is slow
   http.addHeader("Content-Type", "application/json"); // Specify content-type header
   int httpResponseCode = http.POST(payload); // Send the actual POST request
  
   if(httpResponseCode>0){
    JSONVar responseObj = JSON.parse(http.getString());
    String text = (const char*)responseObj["candidates"][0]["content"]["parts"][0]["text"];
    Serial.println("Respuesta: " + text);      
   } else {
  
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
   }
   http.end();
  }else{
    Serial.println("Error in WiFi connection");   
  }
  
  delay(10000);  // Send a request every 10 seconds
}