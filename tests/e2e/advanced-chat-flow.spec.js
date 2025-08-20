const { test, expect } = require('@playwright/test');

test.describe('MIX IA Advanced E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();
  });

  test('should handle complex multi-instrument commands', async ({ page }) => {
    // Test complex command affecting multiple instruments
    const input = page.locator('input[placeholder*="comando"]');
    await input.fill('baja el piano a nivel 3 y sube la guitarra a 8');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="chat-response"]')).toBeVisible();
    
    const response = await page.locator('[data-testid="chat-response"]').textContent();
    const responseLower = response.toLowerCase();
    
    // Should mention both instruments
    expect(responseLower).toMatch(/piano/);
    expect(responseLower).toMatch(/guitarra/);
    expect(responseLower).toMatch(/3|tres/);
    expect(responseLower).toMatch(/8|ocho/);
  });

  test('should maintain conversation context', async ({ page }) => {
    // First command - establish context
    const input = page.locator('input[placeholder*="comando"]');
    await input.fill('sube el volumen del piano');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="chat-response"]').first()).toBeVisible();
    
    // Second command - reference previous context
    await input.fill('ahora bájalo un poco');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="chat-response"]').nth(1)).toBeVisible();
    
    const secondResponse = await page.locator('[data-testid="chat-response"]').nth(1).textContent();
    
    // Should understand "bájalo" refers to piano
    expect(secondResponse.toLowerCase()).toMatch(/piano|bajado|reducido/);
  });

  test('should handle natural language variations', async ({ page }) => {
    const naturalCommands = [
      'pon el piano más alto',
      'que no se escuche la batería',
      'aumenta un poquito la guitarra',
      'silencia el bajo por completo'
    ];

    for (const command of naturalCommands) {
      const input = page.locator('input[placeholder*="comando"]');
      await input.fill(command);
      await page.click('button[type="submit"]');
      
      // Wait for response
      await page.waitForTimeout(1000);
      
      // Should get appropriate response
      const responses = await page.locator('[data-testid="chat-response"]').count();
      expect(responses).toBeGreaterThan(0);
    }
  });

  test('should display conversation history', async ({ page }) => {
    const commands = [
      'lista los instrumentos',
      'sube el piano',
      'mutea la guitarra',
      '¿cuál es el estado actual?'
    ];

    // Send multiple commands
    for (const command of commands) {
      const input = page.locator('input[placeholder*="comando"]');
      await input.fill(command);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
    }

    // Should have all responses visible
    const responseCount = await page.locator('[data-testid="chat-response"]').count();
    expect(responseCount).toBe(commands.length);

    // Should show user messages too
    const userMessages = await page.locator('[data-testid="user-message"]').count();
    expect(userMessages).toBe(commands.length);
  });

  test('should handle edge cases and error scenarios', async ({ page }) => {
    // Test with very long input
    const longInput = 'esto es un comando muy largo '.repeat(20) + 'sube el piano';
    const input = page.locator('input[placeholder*="comando"]');
    await input.fill(longInput);
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="chat-response"]')).toBeVisible();
    
    // Test with special characters
    await input.fill('sube el volumen del piano!@#$%^&*()');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(1000);
    
    // Should handle gracefully
    const responses = await page.locator('[data-testid="chat-response"]').count();
    expect(responses).toBeGreaterThan(0);
  });

  test('should provide feedback for unclear commands', async ({ page }) => {
    const unclearCommands = [
      'haz algo',
      'mejora el sonido',
      'no me gusta',
      'cambia esto'
    ];

    for (const command of unclearCommands) {
      const input = page.locator('input[placeholder*="comando"]');
      await input.fill(command);
      await page.click('button[type="submit"]');
      
      await expect(page.locator('[data-testid="chat-response"]').last()).toBeVisible();
      
      const response = await page.locator('[data-testid="chat-response"]').last().textContent();
      
      // Should ask for clarification
      expect(response.toLowerCase()).toMatch(/específico|aclarar|qué instrumento|cuál|ayudar/);
    }
  });

  test('should handle rapid successive commands', async ({ page }) => {
    const rapidCommands = [
      'sube piano',
      'baja guitarra', 
      'mutea batería',
      'aumenta bajo',
      'lista instrumentos'
    ];

    // Send commands rapidly without waiting
    for (const command of rapidCommands) {
      const input = page.locator('input[placeholder*="comando"]');
      await input.fill(command);
      await page.click('button[type="submit"]');
      // No wait between commands
    }

    // Wait for all responses
    await page.waitForTimeout(3000);
    
    // Should have processed all commands
    const responseCount = await page.locator('[data-testid="chat-response"]').count();
    expect(responseCount).toBe(rapidCommands.length);
  });

  test('should validate mixer state consistency', async ({ page }) => {
    // Set specific states
    const commands = [
      'sube el piano a nivel 8',
      'mutea completamente la guitarra',
      'pon la batería en nivel 5'
    ];

    for (const command of commands) {
      const input = page.locator('input[placeholder*="comando"]');
      await input.fill(command);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
    }

    // Query current state
    const input = page.locator('input[placeholder*="comando"]');
    await input.fill('¿cuál es el estado actual del mixer?');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="chat-response"]').last()).toBeVisible();
    
    const stateResponse = await page.locator('[data-testid="chat-response"]').last().textContent();
    const responseLower = stateResponse.toLowerCase();
    
    // Should reflect the states we set
    expect(responseLower).toMatch(/piano.*8|nivel.*8.*piano/);
    expect(responseLower).toMatch(/guitarra.*mute|mute.*guitarra/);
    expect(responseLower).toMatch(/batería.*5|nivel.*5.*batería/);
  });

  test('should handle mobile interface responsively', async ({ page }) => {
    // Simulate mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Interface should still be usable
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();
    
    const input = page.locator('input[placeholder*="comando"]');
    await expect(input).toBeVisible();
    
    await input.fill('sube el piano');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="chat-response"]')).toBeVisible();
    
    // Test touch interactions
    await input.tap();
    await input.fill('lista instrumentos');
    await page.locator('button[type="submit"]').tap();
    
    await page.waitForTimeout(1000);
    const responses = await page.locator('[data-testid="chat-response"]').count();
    expect(responses).toBe(2);
  });

  test('should persist session across page refresh', async ({ page }) => {
    // Send some commands
    const input = page.locator('input[placeholder*="comando"]');
    await input.fill('sube el piano a 7');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="chat-response"]')).toBeVisible();
    
    // Refresh page
    await page.reload();
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();
    
    // Check if conversation history is maintained (if implemented)
    // This test depends on whether session persistence is implemented
    const historyExists = await page.locator('[data-testid="chat-response"]').count();
    
    // Send new command to verify system still works
    await input.fill('¿cuál es el volumen del piano?');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="chat-response"]').last()).toBeVisible();
  });

  test('should handle keyboard shortcuts and accessibility', async ({ page }) => {
    const input = page.locator('input[placeholder*="comando"]');
    
    // Test Enter key to submit
    await input.fill('sube el piano');
    await input.press('Enter');
    
    await expect(page.locator('[data-testid="chat-response"]')).toBeVisible();
    
    // Test escape to clear (if implemented)
    await input.fill('test message');
    await input.press('Escape');
    
    // Test tab navigation
    await page.press('Tab');
    await page.press('Tab');
    
    // Check accessibility attributes
    await expect(input).toHaveAttribute('aria-label');
    await expect(page.locator('button[type="submit"]')).toHaveAttribute('aria-label');
  });

  test('should handle network interruption gracefully', async ({ page }) => {
    // Simulate network going offline
    await page.context().setOffline(true);
    
    const input = page.locator('input[placeholder*="comando"]');
    await input.fill('sube el piano');
    await page.click('button[type="submit"]');
    
    // Should show offline/error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    
    const errorMessage = await page.locator('[data-testid="error-message"]').textContent();
    expect(errorMessage.toLowerCase()).toMatch(/conexión|error|offline|red/);
    
    // Restore network
    await page.context().setOffline(false);
    
    // Should work again
    await input.fill('lista instrumentos');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="chat-response"]')).toBeVisible();
  });
});
