# The Astronauts DAO - API Documentation

## API Overview

The Astronauts DAO API provides a comprehensive set of endpoints for interacting with the DAO's functionality. This RESTful API follows OpenAPI specifications and uses JWT authentication with Web3 wallet signatures.

## Base URL

```
Production: https://api.theastronauts.dao
Staging: https://staging-api.theastronauts.dao
Development: http://localhost:3001
```

## Authentication

### Web3 Authentication Flow

1. Request Challenge
```http
POST /auth/challenge
Content-Type: application/json

{
  "address": "0x..."
}
```

Response:
```json
{
  "challenge": "Sign this message to authenticate: {nonce}"
}
```

2. Verify Signature
```http
POST /auth/verify
Content-Type: application/json

{
  "address": "0x...",
  "signature": "0x..."
}
```

Response:
```json
{
  "token": "jwt.token.here",
  "expiresIn": 3600
}
```

### Using Authentication

Include the JWT token in the Authorization header:
```http
Authorization: Bearer jwt.token.here
```

## Proposals

### List Proposals

```http
GET /proposals
```

Query Parameters:
- `status`: Filter by proposal status (active, pending, executed, failed)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field (created_at, votes, status)
- `order`: Sort order (asc, desc)

Response:
```json
{
  "proposals": [
    {
      "id": "uuid",
      "title": "Proposal Title",
      "description": "Proposal Description",
      "status": "active",
      "proposer": "0x...",
      "startTime": "2024-03-20T00:00:00Z",
      "endTime": "2024-03-27T00:00:00Z",
      "votesFor": "1000000000000000000",
      "votesAgainst": "500000000000000000",
      "actions": [
        {
          "target": "0x...",
          "value": "0",
          "data": "0x..."
        }
      ]
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

### Get Proposal

```http
GET /proposals/{id}
```

Response:
```json
{
  "id": "uuid",
  "title": "Proposal Title",
  "description": "Proposal Description",
  "status": "active",
  "proposer": "0x...",
  "startTime": "2024-03-20T00:00:00Z",
  "endTime": "2024-03-27T00:00:00Z",
  "votesFor": "1000000000000000000",
  "votesAgainst": "500000000000000000",
  "actions": [
    {
      "target": "0x...",
      "value": "0",
      "data": "0x..."
    }
  ],
  "votes": [
    {
      "voter": "0x...",
      "support": true,
      "weight": "100000000000000000",
      "reason": "I support this proposal"
    }
  ]
}
```

### Create Proposal

```http
POST /proposals
Content-Type: application/json

{
  "title": "Proposal Title",
  "description": "Proposal Description",
  "actions": [
    {
      "target": "0x...",
      "value": "0",
      "data": "0x..."
    }
  ]
}
```

Response:
```json
{
  "id": "uuid",
  "status": "pending",
  "transactionHash": "0x..."
}
```

### Cast Vote

```http
POST /proposals/{id}/votes
Content-Type: application/json

{
  "support": true,
  "reason": "I support this proposal"
}
```

Response:
```json
{
  "transactionHash": "0x..."
}
```

## Treasury

### Get Balance

```http
GET /treasury/balance
```

Response:
```json
{
  "nativeToken": "1000000000000000000",
  "tokens": [
    {
      "address": "0x...",
      "symbol": "DAI",
      "decimals": 18,
      "balance": "1000000000000000000"
    }
  ]
}
```

### Get Transactions

```http
GET /treasury/transactions
```

Query Parameters:
- `type`: Filter by transaction type (incoming, outgoing)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Response:
```json
{
  "transactions": [
    {
      "hash": "0x...",
      "type": "incoming",
      "from": "0x...",
      "to": "0x...",
      "value": "1000000000000000000",
      "token": "0x...",
      "timestamp": "2024-03-20T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

## Members

### Get Member

```http
GET /members/{address}
```

Response:
```json
{
  "address": "0x...",
  "votingPower": "1000000000000000000",
  "delegatedPower": "500000000000000000",
  "delegatedTo": "0x...",
  "proposals": {
    "created": 5,
    "voted": 20
  },
  "joinedAt": "2024-01-01T00:00:00Z"
}
```

### Get Delegates

```http
GET /members/{address}/delegates
```

Response:
```json
{
  "delegators": [
    {
      "address": "0x...",
      "amount": "100000000000000000"
    }
  ],
  "total": "500000000000000000"
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      "field": "Additional error details"
    }
  }
}
```

Common Error Codes:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `429`: Too Many Requests
- `500`: Internal Server Error

## Rate Limiting

The API implements rate limiting based on the following rules:
- Authentication endpoints: 5 requests per minute
- Other endpoints: 60 requests per minute per authenticated user
- Public endpoints: 30 requests per minute per IP

Rate limit headers are included in all responses:
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1500000000
```

## Websocket Events

Connect to the websocket endpoint:
```
wss://api.theastronauts.dao/ws
```

Available events:
- `proposal:created`
- `proposal:updated`
- `vote:cast`
- `treasury:transaction`

Event format:
```json
{
  "event": "proposal:created",
  "data": {
    // Event specific data
  }
}
```

## SDK Example

```typescript
import { AstronautsDAO } from '@astronauts/sdk';

const dao = new AstronautsDAO({
  apiUrl: 'https://api.theastronauts.dao',
  token: 'jwt.token.here'
});

// Create proposal
const proposal = await dao.proposals.create({
  title: 'My Proposal',
  description: 'Description',
  actions: []
});

// Cast vote
await dao.proposals.vote(proposal.id, {
  support: true,
  reason: 'I support this'
});

// Get treasury balance
const balance = await dao.treasury.getBalance();
``` 