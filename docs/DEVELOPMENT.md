# The Astronauts DAO - Development Guide

## Getting Started

This guide will help you set up your development environment and understand the development workflow for The Astronauts DAO platform.

## Prerequisites

### Required Software

1. Node.js and npm
```bash
# Install Node.js LTS version
nvm install --lts
nvm use --lts

# Verify installation
node --version  # v18.x or higher
npm --version   # v9.x or higher
```

2. Git
```bash
# Install Git
# Windows: Download from https://git-scm.com/download/win
# macOS: brew install git
# Linux: sudo apt install git

# Verify installation
git --version  # v2.x or higher
```

3. Docker
```bash
# Install Docker
# Windows/macOS: Download Docker Desktop
# Linux: curl -fsSL https://get.docker.com | sh

# Verify installation
docker --version  # v20.x or higher
docker-compose --version  # v2.x or higher
```

### Development Tools

1. Visual Studio Code
   - Install recommended extensions:
     - ESLint
     - Prettier
     - Solidity
     - Tailwind CSS IntelliSense
     - GitLens

2. Browser Extensions
   - MetaMask
   - React Developer Tools
   - Redux DevTools

3. Command Line Tools
```bash
# Install global dependencies
npm install -g typescript
npm install -g hardhat
npm install -g prisma
```

## Project Structure

```
astronauts-dao/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Next.js pages
│   │   ├── styles/         # CSS and Tailwind styles
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   ├── tests/              # Frontend tests
│   └── package.json        # Frontend dependencies
├── backend/                 # Express.js backend service
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema and migrations
│   ├── tests/              # Backend tests
│   └── package.json        # Backend dependencies
├── contracts/               # Smart contracts
│   ├── contracts/          # Solidity contracts
│   ├── scripts/            # Deployment scripts
│   ├── test/              # Contract tests
│   └── hardhat.config.ts   # Hardhat configuration
├── infrastructure/          # Infrastructure as code
│   ├── terraform/          # Terraform configurations
│   └── kubernetes/         # Kubernetes manifests
└── docs/                   # Documentation
```

## Development Workflow

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-org/astronauts-dao.git
cd astronauts-dao

# Install dependencies
npm install
```

### 2. Environment Setup

1. Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_INFURA_ID=your_infura_project_id
NEXT_PUBLIC_CHAIN_ID=5
NEXT_PUBLIC_GOVERNOR_ADDRESS=0x...
NEXT_PUBLIC_TOKEN_ADDRESS=0x...
```

2. Backend (.env)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/astronauts_dao
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
INFURA_PROJECT_ID=your_infura_project_id
PRIVATE_KEY=your_private_key
```

### 3. Database Setup

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Create database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed
```

### 4. Smart Contract Development

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start local blockchain
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.ts --network localhost
```

### 5. Start Development Servers

```bash
# Start frontend
cd frontend
npm run dev

# Start backend
cd backend
npm run dev
```

## Development Guidelines

### Code Style

1. TypeScript
```typescript
// Use interfaces for object types
interface Proposal {
  id: string;
  title: string;
  description: string;
  actions: ProposalAction[];
}

// Use enums for fixed values
enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed
}

// Use type guards
function isProposal(obj: any): obj is Proposal {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    Array.isArray(obj.actions)
  );
}
```

2. React Components
```typescript
// Use functional components with TypeScript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  onClick
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

3. Solidity
```solidity
// Use latest stable version
pragma solidity ^0.8.19;

// Use descriptive names and NatSpec comments
/// @title Governance token for Astronauts DAO
/// @author Your Name
/// @notice This contract implements the governance token
contract AstronautsToken is ERC20Votes {
    /// @notice Creates a new token instance
    /// @param name The name of the token
    /// @param symbol The symbol of the token
    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) ERC20Permit(name) {}
}
```

### Testing

1. React Components
```typescript
import { render, screen, fireEvent } from '@testing-library/react';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(
      <Button variant="primary" onClick={handleClick}>
        Click me
      </Button>
    );
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

2. Smart Contracts
```typescript
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('AstronautsGovernor', function() {
  let governor: AstronautsGovernor;
  let token: AstronautsToken;
  let owner: SignerWithAddress;

  beforeEach(async function() {
    [owner] = await ethers.getSigners();
    
    const Token = await ethers.getContractFactory('AstronautsToken');
    token = await Token.deploy('Astronauts', 'ASTRO');
    await token.deployed();
    
    const Governor = await ethers.getContractFactory('AstronautsGovernor');
    governor = await Governor.deploy(token.address);
    await governor.deployed();
  });

  it('should create proposal', async function() {
    await token.delegate(owner.address);
    
    const tx = await governor.propose(
      [token.address],
      [0],
      [token.interface.encodeFunctionData('mint', [
        owner.address,
        ethers.utils.parseEther('1000')
      ])],
      'Mint tokens'
    );
    
    const receipt = await tx.wait();
    const event = receipt.events?.find(
      e => e.event === 'ProposalCreated'
    );
    
    expect(event).to.not.be.undefined;
    expect(await governor.state(event.args.proposalId))
      .to.equal(0); // Pending
  });
});
```

### Error Handling

1. Frontend
```typescript
// Use custom error types
interface ApiError extends Error {
  code: string;
  status: number;
}

// Create error handling hook
function useErrorHandler() {
  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      if ((error as ApiError).status === 401) {
        // Handle unauthorized
        return;
      }
      // Handle other errors
    }
  }, []);

  return handleError;
}
```

2. Backend
```typescript
// Create custom error classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Use error middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message
      }
    });
    return;
  }
  
  // Handle other errors
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
};
```

### Performance Optimization

1. React Components
```typescript
// Use memo for expensive computations
const memoizedValue = useMemo(() => {
  return expensiveCalculation(prop);
}, [prop]);

// Use callback for event handlers
const handleClick = useCallback(() => {
  // Handle click
}, []);

// Use virtualization for long lists
import { VirtualizedList } from 'react-virtualized';

function ProposalList({ proposals }: { proposals: Proposal[] }) {
  return (
    <VirtualizedList
      width={800}
      height={600}
      rowCount={proposals.length}
      rowHeight={100}
      rowRenderer={({ index, style }) => (
        <ProposalCard
          key={proposals[index].id}
          proposal={proposals[index]}
          style={style}
        />
      )}
    />
  );
}
```

2. Smart Contracts
```solidity
// Use efficient data structures
mapping(uint256 => Proposal) public proposals;

// Batch operations
function batchTransfer(
    address[] calldata recipients,
    uint256[] calldata amounts
) external {
    require(
        recipients.length == amounts.length,
        "Length mismatch"
    );
    
    for (uint256 i; i < recipients.length; ++i) {
        _transfer(msg.sender, recipients[i], amounts[i]);
    }
}
```

## Git Workflow

### Branch Naming

- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`
- Release branches: `release/version`

### Commit Messages

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code style changes
- refactor: Code refactoring
- test: Test changes
- chore: Build/config changes

Example:
```
feat(proposals): add proposal preview functionality

- Add ProposalPreview component
- Integrate with form
- Add validation

Closes #123
```

### Pull Request Process

1. Create feature branch
```bash
git checkout -b feature/proposal-preview
```

2. Make changes and commit
```bash
git add .
git commit -m "feat(proposals): add proposal preview"
```

3. Push changes
```bash
git push origin feature/proposal-preview
```

4. Create pull request
   - Use template
   - Add description
   - Link issues
   - Request reviews

5. Address feedback
```bash
git commit -m "fix(proposals): address review feedback"
git push origin feature/proposal-preview
```

6. Merge pull request
```bash
git checkout main
git pull origin main
```

## Debugging

### Frontend

1. React Developer Tools
   - Components tab
   - Profiler tab
   - Props/State inspection

2. Console Logging
```typescript
// Use debug namespace
import debug from 'debug';
const log = debug('app:proposals');

function ProposalList() {
  log('Rendering proposal list');
  // Component code
}
```

3. Error Boundaries
```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Smart Contracts

1. Hardhat Console
```typescript
// Use console.log in contracts
import "hardhat/console.sol";

function propose() external {
    console.log(
        "Creating proposal from %s",
        msg.sender
    );
    // Function code
}
```

2. Event Logging
```solidity
event Debug(
    string message,
    address sender,
    uint256 value
);

function debugFunction() external {
    emit Debug(
        "Debug message",
        msg.sender,
        msg.value
    );
}
```

3. Test Helpers
```typescript
// Create helper functions
async function mineBlocks(n: number) {
  for (let i = 0; i < n; i++) {
    await ethers.provider.send('evm_mine', []);
  }
}

// Use in tests
it('should execute after delay', async function() {
  await propose();
  await mineBlocks(VOTING_DELAY);
  // Test execution
});
```

## Documentation

### Code Documentation

1. TypeScript
```typescript
/**
 * Creates a new proposal
 * @param title - The proposal title
 * @param description - The proposal description
 * @param actions - List of proposal actions
 * @returns The created proposal ID
 * @throws {ValidationError} If parameters are invalid
 */
async function createProposal(
  title: string,
  description: string,
  actions: ProposalAction[]
): Promise<string> {
  // Function implementation
}
```

2. Solidity
```solidity
/// @title Governance token for Astronauts DAO
/// @author Your Name
/// @notice This contract implements the governance token
/// @dev Inherits from OpenZeppelin's ERC20Votes
contract AstronautsToken is ERC20Votes {
    /// @notice Creates a new token instance
    /// @param name The name of the token
    /// @param symbol The symbol of the token
    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) ERC20Permit(name) {}

    /// @notice Mints new tokens
    /// @param to The recipient address
    /// @param amount The amount to mint
    /// @dev Only callable by governance
    function mint(
        address to,
        uint256 amount
    ) external onlyGovernance {
        _mint(to, amount);
    }
}
```

### API Documentation

1. OpenAPI Specification
```yaml
paths:
  /proposals:
    post:
      summary: Create new proposal
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProposalInput'
      responses:
        '201':
          description: Proposal created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Proposal'
```

2. API Examples
```typescript
// Example requests in documentation
async function exampleApiUsage() {
  // Create proposal
  const proposal = await api.post('/proposals', {
    title: 'Example Proposal',
    description: 'This is an example',
    actions: []
  });

  // Get proposal
  const result = await api.get(`/proposals/${proposal.id}`);
}
```

## Continuous Integration

### GitHub Actions

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Run contract tests
        run: npx hardhat test
```

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.sol": [
      "solhint",
      "prettier --write"
    ]
  }
}
``` 