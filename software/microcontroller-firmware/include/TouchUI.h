#pragma once
#include <M5GFX.h>
#include <vector>
#include <functional>

struct TouchButton
{
  int x, y, w, h;
  uint16_t bg;
  uint16_t fg;
  uint16_t border;
  String label;
  std::function<void()> onTap;

  bool contains(int tx, int ty) const
  {
    return (tx >= x && tx < x + w && ty >= y && ty < y + h);
  }

  void draw(M5GFX &tft, bool pressed = false) const
  {
    uint16_t useBg = pressed ? tft.color565(20, 20, 20) ^ bg : bg;
    tft.fillRoundRect(x, y, w, h, 16, useBg);
    tft.drawRoundRect(x, y, w, h, 16, border);
    tft.setFont(&fonts::Font0);
    tft.setTextDatum(textdatum_t::middle_center);
    tft.setTextColor(0b1111111111111111);
    tft.drawString(label, x + w / 2, y + h / 2);
  }
};

class TouchUI
{
public:
  explicit TouchUI(M5GFX &display) : tft(display) {}

  void begin(uint16_t bgColor, uint16_t textColor);
  void addButton(const TouchButton &btn);
  void drawAll();
  void tick(uint32_t debounceMs = 110);
  void clearButtons()
  {
    buttons.clear();
  }

  // Utilidad para convertir #RRGGBB a RGB565
  static uint16_t rgb565(M5GFX &tft, uint32_t rgb);

private:
  M5GFX &tft;
  std::vector<TouchButton> buttons;
  bool lastPressed = false;
  int lastIdx = -1;
  uint32_t lastTouchAt = 0;

  int findHit(int tx, int ty) const;
  void pressVisual(int idx, bool pressed);
};
