const request = require('supertest');
const app = require('./mock-firmware-server');

describe('Mock Firmware Server', () => {
  
  describe('POST /setVolume', () => {
    it('should set volume successfully', async () => {
      const response = await request(app)
        .post('/setVolume')
        .send({ instrument: 'piano', volume: 7 })
        .expect(200);
      
      expect(response.body.message).toContain('Volume set successfully');
      expect(response.body.instrument).toBe('piano');
      expect(response.body.volume).toBe(7);
    });
    
    it('should reject invalid volume', async () => {
      await request(app)
        .post('/setVolume')
        .send({ instrument: 'piano', volume: 15 })
        .expect(400);
    });
    
    it('should reject unknown instrument', async () => {
      await request(app)
        .post('/setVolume')
        .send({ instrument: 'unknown', volume: 5 })
        .expect(404);
    });
  });
  
  describe('POST /muteChannel', () => {
    it('should mute channel successfully', async () => {
      const response = await request(app)
        .post('/muteChannel')
        .send({ instrument: 'bateria' })
        .expect(200);
      
      expect(response.body.message).toContain('bateria');
      expect(response.body.instrument).toBe('bateria');
      expect(typeof response.body.muted).toBe('boolean');
    });
  });
  
  describe('GET /status', () => {
    it('should return mixer status', async () => {
      const response = await request(app)
        .get('/status')
        .expect(200);
      
      expect(response.body.mixer).toBeDefined();
      expect(response.body.mixer.piano).toBeDefined();
      expect(response.body.timestamp).toBeDefined();
    });
  });
  
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('healthy');
      expect(response.body.uptime).toBeDefined();
    });
  });
});
