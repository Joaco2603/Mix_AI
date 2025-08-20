#include <M5GFX.h>
#include <vector>
#include <functional>
#include "TouchUI.h"

void TouchUI::begin(uint16_t bgColor, uint16_t textColor) {
  tft.init();
  tft.setRotation(1);
  tft.setTextColor(textColor);
  tft.fillScreen(bgColor);
  tft.setTextSize(2);
}

void TouchUI::addButton(const TouchButton& btn) {
  buttons.push_back(btn);
}

void TouchUI::drawAll() {
  for (size_t i = 0; i < buttons.size(); ++i) {
    buttons[i].draw(tft, false);
  }
}

int TouchUI::findHit(int tx, int ty) const {
  for (int i = (int)buttons.size() - 1; i >= 0; --i) {
    if (buttons[i].contains(tx, ty)) return i;
  }
  return -1;
}

void TouchUI::pressVisual(int idx, bool pressed) {
  if (idx >= 0 && idx < (int)buttons.size()) {
    buttons[idx].draw(tft, pressed);
  }
}

void TouchUI::tick(uint32_t debounceMs) {
  // getTouch con M5GFX devuelve bool y coord en touch_point_t
  lgfx::touch_point_t tp;
  bool touched = tft.getTouch(&tp);

  if (touched) {
    int idx = findHit(tp.x, tp.y);
    if (idx != lastIdx) {
      // Quita highlight previo
      if (lastIdx >= 0) pressVisual(lastIdx, false);
      // Pone highlight actual
      if (idx >= 0) pressVisual(idx, true);
      lastIdx = idx;
    }
    lastPressed = (idx >= 0);
  } else {
    if (lastPressed && lastIdx >= 0) {
      // “Tap” válido (debounce simple por tiempo)
      uint32_t now = millis();
      if (now - lastTouchAt > debounceMs) {
        if (buttons[lastIdx].onTap) buttons[lastIdx].onTap();
        lastTouchAt = now;
      }
      // limpiar visual
      pressVisual(lastIdx, false);
    }
    lastPressed = false;
    lastIdx = -1;
  }
}

uint16_t TouchUI::rgb565(M5GFX& tft, uint32_t rgb) {
  uint8_t r = (rgb >> 16) & 0xFF;
  uint8_t g = (rgb >> 8) & 0xFF;
  uint8_t b = (rgb) & 0xFF;
  return tft.color565(r, g, b);
}
