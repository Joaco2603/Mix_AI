const { test, expect } = require('@playwright/test');

test.describe('MIX IA E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the frontend
    await page.goto('http://localhost:3000');
  });

  test('should complete full user flow: volume increase command', async ({ page }) => {
    // Wait for the chat interface to load
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();
    
    // Type a volume command
    const input = page.locator('input[placeholder*="comando"]');
    await input.fill('sube el volumen del piano');
    
    // Click send button
    await page.click('button[type="submit"]');
    
    // Wait for response
    await expect(page.locator('[data-testid="chat-response"]')).toBeVisible();
    
    // Verify response contains expected text
    const response = await page.locator('[data-testid="chat-response"]').textContent();
    expect(response.toLowerCase()).toContain('piano');
  });

  test('should handle mute command', async ({ page }) => {
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();
    
    const input = page.locator('input[placeholder*="comando"]');
    await input.fill('mutea la batería');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="chat-response"]')).toBeVisible();
    
    const response = await page.locator('[data-testid="chat-response"]').textContent();
    expect(response.toLowerCase()).toMatch(/batería|bateria/);
  });

  test('should list available instruments', async ({ page }) => {
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();
    
    const input = page.locator('input[placeholder*="comando"]');
    await input.fill('lista los instrumentos disponibles');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="chat-response"]')).toBeVisible();
    
    const response = await page.locator('[data-testid="chat-response"]').textContent();
    const responseLower = response.toLowerCase();
    
    // Should contain multiple instruments
    const instruments = ['piano', 'guitarra', 'batería', 'bajo', 'voz'];
    const foundInstruments = instruments.filter(instrument => 
      responseLower.includes(instrument) || responseLower.includes(instrument.replace('í', 'i'))
    );
    
    expect(foundInstruments.length).toBeGreaterThan(2);
  });

  test('should reject non-audio questions', async ({ page }) => {
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();
    
    const input = page.locator('input[placeholder*="comando"]');
    await input.fill('¿cuál es la capital de Francia?');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="chat-response"]')).toBeVisible();
    
    const response = await page.locator('[data-testid="chat-response"]').textContent();
    const responseLower = response.toLowerCase();
    
    // Should indicate it only handles audio commands
    expect(responseLower).toMatch(/audio|música|sonido|solo.*audio/);
  });

  test('should show loading state during request', async ({ page }) => {
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();
    
    const input = page.locator('input[placeholder*="comando"]');
    await input.fill('sube el volumen del piano');
    
    // Click send and immediately check for loading state
    await page.click('button[type="submit"]');
    
    // Should show loading indicator
    await expect(page.locator('[data-testid="loading"]')).toBeVisible();
    
    // Wait for response and loading to disappear
    await expect(page.locator('[data-testid="chat-response"]')).toBeVisible();
    await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();
  });

  test('should handle multiple commands in sequence', async ({ page }) => {
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();
    
    // First command
    let input = page.locator('input[placeholder*="comando"]');
    await input.fill('sube el volumen del piano');
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-testid="chat-response"]').first()).toBeVisible();
    
    // Second command
    await input.fill('mutea la guitarra');
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-testid="chat-response"]').nth(1)).toBeVisible();
    
    // Third command
    await input.fill('lista los instrumentos');
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-testid="chat-response"]').nth(2)).toBeVisible();
    
    // Should have 3 responses
    const responses = await page.locator('[data-testid="chat-response"]').count();
    expect(responses).toBe(3);
  });

  test('should validate input and disable send button appropriately', async ({ page }) => {
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();
    
    const input = page.locator('input[placeholder*="comando"]');
    const sendButton = page.locator('button[type="submit"]');
    
    // Send button should be disabled when input is empty
    await expect(sendButton).toBeDisabled();
    
    // Type something
    await input.fill('test command');
    
    // Send button should be enabled
    await expect(sendButton).toBeEnabled();
    
    // Clear input
    await input.fill('');
    
    // Send button should be disabled again
    await expect(sendButton).toBeDisabled();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('**/chat', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();
    
    const input = page.locator('input[placeholder*="comando"]');
    await input.fill('sube el volumen del piano');
    
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    
    const errorMessage = await page.locator('[data-testid="error-message"]').textContent();
    expect(errorMessage.toLowerCase()).toContain('error');
  });
});
