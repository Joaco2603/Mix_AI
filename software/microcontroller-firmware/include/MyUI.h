#include "M5GFX.h"
#include "TouchUI.h"
#include "AudioMixer.h"
#include "AudioPlayer.h"

class MyUI
{
public:
    // Estados de la pantalla
    enum Screen
    {
        HOME,
        DETAIL
    };
    

    MyUI(M5GFX &display) : tft(display), ui(display)
    {
    }

    // Funciones principales
    void init(AudioMixer *mixer, AudioPlayer *player);
    void update();

private:
    // Métodos privados
    void drawHome();
    void drawDetail();
    AudioMixer *mixer;
    AudioPlayer *player;

    // Referencia a la pantalla
    M5GFX &tft;
    TouchUI ui;

    // Variables de estado
    Screen currentScreen = HOME;
    String currentInstrument = "";
    int currentIndex;
    int instrumentVolume = 50; // 0-100

    // Paleta de colores
    uint16_t COL_PRIMARY = 0b1011000100001100;
    uint16_t COL_SECONDARY = 0b1011100010010110;
    uint16_t COL_ACCENT = 0b0001111001010110;
    uint16_t COL_BG = 0b0000000001000010;
    uint16_t COL_TEXT = 0b1111111111111111;
};
