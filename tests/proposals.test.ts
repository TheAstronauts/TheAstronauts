import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../backend/src';
import { prisma } from '../backend/src/lib/prisma';

describe('Proposal API', () => {
  beforeEach(async () => {
    await prisma.vote.deleteMany();
    await prisma.proposal.deleteMany();
  });

  describe('POST /api/proposals', () => {
    it('should create a new proposal', async () => {
      const response = await request(app)
        .post('/api/proposals')
        .send({
          title: 'Test Proposal',
          description: 'This is a test proposal',
          actions: [
            {
              target: '0x1234567890123456789012345678901234567890',
              value: '0',
              data: '0x'
            }
          ]
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Proposal created');
    });

    it('should validate proposal data', async () => {
      const response = await request(app)
        .post('/api/proposals')
        .send({
          title: '',
          description: '',
          actions: []
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });
  });

  describe('GET /api/proposals', () => {
    it('should return all proposals', async () => {
      const response = await request(app).get('/api/proposals');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('proposals');
      expect(Array.isArray(response.body.proposals)).toBe(true);
    });
  });
}); 