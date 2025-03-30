# The Astronauts

<div align="center">
  <img src="frontend/src/assets/logo.png" alt="The Astronauts Logo" width="200" height="200"/>
</div>

<div align="center">
  <h3>Decentralized Governance Platform</h3>
  <p>
    <a href="https://www.theastronauts.xyz" target="_blank">Website</a> |
    <a href="https://x.com/TheAstronauts_X" target="_blank">Twitter</a>
  </p>
</div>

## Overview

The Astronauts is a pioneering decentralized governance platform that revolutionizes community-driven decision making. Built on the principles of transparency, efficiency, and decentralization, our platform empowers communities to manage their governance processes with unprecedented ease and security.

## Core Features

### Proposal Management
- **Smart Creation**: Intuitive interface with pre-built templates
- **Real-time Preview**: Live preview of proposals before submission
- **Version Control**: Track proposal changes and amendments
- **Rich Formatting**: Support for markdown, links, and embedded content

### Advanced Voting System
- **Secure Voting**: Cryptographically secure voting mechanism
- **Multiple Vote Types**: Support for single choice, multiple choice, and quadratic voting
- **Vote Delegation**: Delegate voting power to trusted community members
- **Real-time Results**: Live vote counting and result visualization

### Treasury Management
- **Multi-signature Security**: Advanced treasury protection
- **Transaction Tracking**: Complete history of fund movements
- **Budget Planning**: Tools for financial planning and allocation
- **Asset Dashboard**: Real-time overview of treasury assets

### Member Management
- **Role-based Access**: Granular permission control
- **Member Directory**: Comprehensive member profiles
- **Activity Tracking**: Monitor member participation
- **Reputation System**: Merit-based recognition system

### Template System
- **Governance Templates**: Pre-built templates for common proposals
- **Custom Templates**: Create and save custom templates
- **Template Categories**: Organized by purpose and complexity
- **Template Sharing**: Share effective templates with the community

## Technical Architecture

```
TheAstronauts/
├── contracts/              # Smart Contracts
│   ├── governance/        # Governance contracts
│   ├── treasury/         # Treasury management
│   └── token/           # Token contracts
├── frontend/              # Web Application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/      # Page components
│   │   └── utils/     # Utility functions
├── backend/              # Backend Services
│   ├── api/            # REST API endpoints
│   └── services/      # Business logic
└── docs/               # Documentation
```

## Technical Stack

### Blockchain Layer
- **Network**: Ethereum/Polygon/Solana
- **Smart Contracts**: Solidity
- **Contract Testing**: Hardhat, Foundry

### Frontend Layer
- **Framework**: React.js 18+
- **Styling**: Tailwind CSS, Radix UI
- **State Management**: React Query, Zustand
- **Web3 Integration**: wagmi, viem
- **Type Safety**: TypeScript

### Backend Layer
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **Caching**: Redis
- **Storage**: IPFS/Arweave

## Token Economics

### ASTRO Token
- **Name**: ASTRO
- **Total Supply**: 1,000,000,000
- **Platform**: pump.FUN
- **Decimals**: 18

### Distribution
- 100% Fair Launch
- No pre-mine
- No team allocation
- No investor allocation
- No reserved tokens

### Utility
- Governance voting
- Proposal creation
- Treasury management
- Platform fee discounts
- Community rewards

## Governance Model

### Proposal System (AIPs)
- **Standard Proposals**: Regular governance decisions
- **Emergency Proposals**: Time-sensitive decisions
- **Technical Proposals**: Protocol upgrades
- **Financial Proposals**: Treasury management

### Voting Mechanism
- **Token-weighted Voting**: 1 ASTRO = 1 Vote
- **Voting Period**: 7 days standard
- **Quorum**: 4% of total supply
- **Execution Delay**: 2 days

### Security Measures
- Multi-signature requirements
- Timelock mechanisms
- Emergency pause functionality
- Automated security audits

## Community

Join our growing community:
- [Twitter](https://x.com/TheAstronauts_X)
- [Website](https://www.theastronauts.xyz)

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Web3 wallet (e.g., MetaMask)
- Basic understanding of blockchain technology

### Installation

1. Clone the repository
```bash
git clone https://github.com/TheAstronauts/TheAstronauts.git
cd TheAstronauts
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development server
```bash
npm run dev
# or
yarn dev
```

## Contributing

We welcome contributions from the community! Before contributing, please:

1. Check existing issues or create a new one
2. Fork the repository
3. Create a feature branch
4. Submit a pull request

## License

This project is licensed under the MIT License.

---

"Space exploration belongs to everyone. The Astronauts, connecting Earth to the stars." 