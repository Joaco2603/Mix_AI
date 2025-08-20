#include <M5GFX.h>

#include "MyUI.h"
#include "AudioMixer.h"
#include "TouchUI.h"
#include "AudioPlayer.h"

void MyUI::init(AudioMixer *m, AudioPlayer *p)
{
    mixer = m;
    player = p;
    drawHome();
}

// Redibuja la pantalla Home (botones instrumentos)
void MyUI::drawHome()
{
    ui.begin(COL_BG, COL_TEXT);

    float porcentaje = (player->getVolume() / 21.0) * 100.0;
    String text_porcentage = String(porcentaje, 1) + "%"; // Muestra un decimal
    String text_completed = "Volumen: " + text_porcentage;
    tft.drawString(text_completed, 2, 20);

    // Botón subir volumen
    ui.addButton(TouchButton{
        50, 40, 60, 60,
        COL_PRIMARY, COL_BG, COL_ACCENT,
        "+",
        [this]()
        {
            int stepVolume = player->getVolume(); // 0–21
            float percent = (stepVolume / 21.0f) * 100.0f;
            player->setMasterVolume(std::min(100.0f, percent + 10));
            drawHome();
        }});

    // Botón bajar volumen
    ui.addButton(TouchButton{
        170, 40, 60, 60,
        COL_SECONDARY, COL_BG, COL_ACCENT,
        "-",
        [this]()
        {
            int stepVolume = player->getVolume(); // 0–21
            float percent = (stepVolume / 21.0f) * 100.0f;
            player->setMasterVolume(std::min(100.0f, percent - 10));
            drawHome();
        }});

    ui.addButton(TouchButton{
        20, 105, 110, 60,
        COL_PRIMARY, COL_BG, COL_TEXT,
        "Guitarra",
        [this]()
        { currentInstrument = "Guitarra"; currentScreen = DETAIL; currentIndex = 0; }});
    ui.addButton(TouchButton{
        170, 105, 110, 60,
        COL_SECONDARY, COL_BG, COL_ACCENT,
        "Voz",
        [this]()
        { currentInstrument = "Voz"; currentScreen = DETAIL; currentIndex = 1; }});
    ui.addButton(TouchButton{
        20, 170, 110, 60,
        COL_ACCENT, COL_BG, COL_TEXT,
        "Bajo",
        [this]()
        { currentInstrument = "Bajo";currentScreen= DETAIL; currentIndex = 2; }});
    ui.addButton(TouchButton{
        170, 170, 110, 60,
        TouchUI::rgb565(tft, 0x0E1526), COL_ACCENT, COL_TEXT,
        "Bateria",
        [this]()
        {currentInstrument = "Bateria";currentScreen = DETAIL; currentIndex = 3; }});
    ui.drawAll();
}

// Redibuja la pantalla de detalle
void MyUI::drawDetail()
{
    ui.begin(COL_BG, COL_TEXT);
    ui.clearButtons();

    // Botón Volver
    ui.addButton(TouchButton{
        10, 10, 80, 50,
        COL_ACCENT, COL_BG, COL_TEXT,
        "Volver",
        [this]()
        {
            currentScreen = HOME;
            ui.clearButtons();
        }});

    // Texto con el nombre del instrumento
    tft.setTextDatum(textdatum_t::top_center);
    tft.setTextColor(COL_TEXT);
    tft.setTextSize(3);
    tft.drawString(currentInstrument, tft.width() / 2, 80);

    // Botón subir volumen
    ui.addButton(TouchButton{
        50, 160, 100, 60,
        COL_PRIMARY, COL_BG, COL_ACCENT,
        "+",
        [this]()
        {
            instrumentVolume = min(100, instrumentVolume + 10);
            mixer->getChannel(currentIndex).setGain(instrumentVolume / 100.0f);
            drawDetail();
        }});

    // Botón bajar volumen
    ui.addButton(TouchButton{
        170, 160, 100, 60,
        COL_SECONDARY, COL_BG, COL_ACCENT,
        "-",
        [this]()
        {
            instrumentVolume = max(0, instrumentVolume - 10);
            mixer->getChannel(currentIndex).setGain(instrumentVolume / 100.0f);
            drawDetail();
        }});

    // Mostrar valor volumen
    tft.setTextDatum(textdatum_t::top_center);
    tft.setTextColor(COL_TEXT);
    tft.setTextSize(2);
    instrumentVolume = static_cast<int>(mixer->getChannel(currentIndex).getGain() * 100.0f);
    tft.drawString("Volumen: " + String(instrumentVolume), tft.width() / 2, 100);

    ui.drawAll();
}

void MyUI::update()
{
    ui.tick();

    // Si se cambió de pantalla, redibuja
    static Screen lastScreen = HOME;
    if (currentScreen != lastScreen)
    {
        if (currentScreen == HOME)
            drawHome();
        else if (currentScreen == DETAIL)
            drawDetail();
        lastScreen = currentScreen;
    }
}