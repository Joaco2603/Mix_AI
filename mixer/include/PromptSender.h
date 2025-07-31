#ifndef PROMPT_SENDER_H
#define PROMPT_SENDER_H

#include <Arduino.h>

class PromptSender
{
public:
    PromptSender();
    bool initWiFi();
    bool sendPrompt(const String &prompt);
    bool isWiFiConnected();

private:
    static const char *ssid;
    static const char *password;
    static const char *serverUrl;
    bool wifiConnected;
};

#endif