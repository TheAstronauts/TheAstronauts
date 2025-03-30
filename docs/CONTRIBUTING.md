# The Astronauts DAO - Contributing Guide

## Introduction

Thank you for considering contributing to The Astronauts DAO! This guide will help you understand how to contribute to the project, from reporting bugs to submitting pull requests.

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team. All complaints will be reviewed and investigated promptly and fairly.

## Getting Started

### Prerequisites

1. Development Environment
```bash
# Required software versions
node >= 18.0.0
npm >= 9.0.0
git >= 2.0.0
docker >= 20.0.0
```

2. Local Setup
```bash
# Clone repository
git clone https://github.com/your-org/astronauts-dao.git
cd astronauts-dao

# Install dependencies
npm install

# Setup environment
cp .env.example .env
```

3. Development Tools
```bash
# Install global tools
npm install -g typescript
npm install -g hardhat
npm install -g prisma
```

## Development Process

### Branching Strategy

1. Branch Types
```
main        - Production-ready code
develop     - Development branch
feature/*   - New features
fix/*       - Bug fixes
docs/*      - Documentation updates
refactor/*  - Code improvements
```

2. Branch Naming
```
feature/add-proposal-preview
fix/voting-calculation
docs/api-documentation
refactor/optimize-queries
```

3. Branch Workflow
```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/your-feature

# Regular commits
git add .
git commit -m "feat: add feature description"

# Push changes
git push origin feature/your-feature
```

### Commit Messages

1. Format
```
type(scope): description

[optional body]

[optional footer]
```

2. Types
```
feat     - New feature
fix      - Bug fix
docs     - Documentation
style    - Formatting
refactor - Code restructure
test     - Tests
chore    - Maintenance
```

3. Examples
```
feat(proposals): add proposal preview functionality
fix(voting): correct vote weight calculation
docs(api): update endpoint documentation
style(components): format according to style guide
```

## Pull Requests

### Preparation

1. Code Quality
```bash
# Run linter
npm run lint

# Run tests
npm run test

# Check coverage
npm run coverage
```

2. Documentation
```bash
# Generate docs
npm run docs

# Update API docs
npm run api-docs
```

3. Changelog
```markdown
## [Unreleased]
### Added
- New proposal preview feature
- Vote delegation UI

### Fixed
- Vote calculation bug
- Transaction handling
```

### Submission Process

1. Pull Request Template
```markdown
## Description
Brief description of changes

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing done

## Checklist
- [ ] Tests added
- [ ] Documentation updated
- [ ] Changelog updated
```

2. Review Process
```
1. Submit PR
2. Pass CI checks
3. Code review
4. Address feedback
5. Final approval
6. Merge
```

3. Merge Requirements
```
- All tests passing
- Code review approved
- Documentation updated
- Changelog updated
- CI checks passed
```

## Testing

### Unit Tests

1. Component Tests
```typescript
describe('ProposalCard', () => {
  it('renders proposal details', () => {
    const proposal = {
      id: '1',
      title: 'Test Proposal',
      description: 'Description'
    };
    
    render(<ProposalCard proposal={proposal} />);
    expect(screen.getByText('Test Proposal')).toBeInTheDocument();
  });
});
```

2. Contract Tests
```typescript
describe('AstronautsGovernor', () => {
  it('creates proposal', async () => {
    const [owner] = await ethers.getSigners();
    const proposal = await governor.propose(
      [target],
      [value],
      [data],
      'Test Proposal'
    );
    
    expect(await governor.state(proposal.id))
      .to.equal(ProposalState.Pending);
  });
});
```

### Integration Tests

1. API Tests
```typescript
describe('Proposal API', () => {
  it('creates new proposal', async () => {
    const response = await request(app)
      .post('/api/proposals')
      .send({
        title: 'Test Proposal',
        description: 'Description',
        actions: []
      });
    
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Proposal');
  });
});
```

2. E2E Tests
```typescript
describe('Proposal Flow', () => {
  it('completes proposal lifecycle', async () => {
    // Create proposal
    await page.click('#create-proposal');
    await page.fill('#title', 'Test Proposal');
    await page.click('#submit');
    
    // Vote on proposal
    await page.click('#vote-for');
    await page.click('#confirm-vote');
    
    // Check results
    const result = await page.textContent('#vote-results');
    expect(result).toContain('Passed');
  });
});
```

## Documentation

### Code Documentation

1. TypeScript
```typescript
/**
 * Creates a new proposal
 * @param title - Proposal title
 * @param description - Proposal description
 * @param actions - List of actions
 * @returns Created proposal ID
 * @throws {ValidationError} If parameters invalid
 */
async function createProposal(
  title: string,
  description: string,
  actions: Action[]
): Promise<string> {
  // Implementation
}
```

2. Solidity
```solidity
/// @title Governance token for Astronauts DAO
/// @author Your Name
/// @notice Implements the governance token
/// @dev Extends ERC20Votes
contract AstronautsToken is ERC20Votes {
    /// @notice Creates new token
    /// @param name Token name
    /// @param symbol Token symbol
    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) ERC20Permit(name) {}
}
```

### API Documentation

1. OpenAPI
```yaml
paths:
  /proposals:
    post:
      summary: Create proposal
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProposalInput'
      responses:
        '201':
          description: Proposal created
```

2. Examples
```typescript
// API usage example
async function createProposal() {
  const response = await api.post('/proposals', {
    title: 'Example',
    description: 'Description',
    actions: []
  });
  return response.data;
}
```

## Style Guide

### TypeScript Style

1. Naming
```typescript
// Interfaces
interface ProposalData {
  id: string;
  title: string;
}

// Components
const ProposalCard: React.FC<ProposalProps> = () => {};

// Functions
function calculateVoteWeight(): number {}

// Constants
const MAX_PROPOSALS = 10;
```

2. Formatting
```typescript
// Imports
import React from 'react';
import { useQuery } from 'react-query';
import type { Proposal } from './types';

// Component structure
function Component() {
  // State
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {}, []);
  
  // Handlers
  const handleClick = () => {};
  
  // Render
  return <div />;
}
```

### Solidity Style

1. Layout
```solidity
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    // State variables
    uint256 public constant MAX_SUPPLY = 1000000;
    
    // Events
    event TokensMinted(address indexed to, uint256 amount);
    
    // Constructor
    constructor() ERC20("Token", "TKN") {}
    
    // External functions
    function mint() external {}
    
    // Internal functions
    function _beforeTokenTransfer() internal {}
}
```

2. Security
```solidity
// Use SafeMath for math operations
using SafeMath for uint256;

// Check-Effects-Interactions pattern
function withdraw() external {
    uint256 amount = balances[msg.sender];
    balances[msg.sender] = 0;
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}
```

## Release Process

### Version Control

1. Versioning
```
Major.Minor.Patch
1.0.0 - Initial release
1.1.0 - New features
1.1.1 - Bug fixes
```

2. Tags
```bash
# Create version tag
git tag -a v1.0.0 -m "Version 1.0.0"

# Push tags
git push origin v1.0.0
```

3. Changelog
```markdown
# Changelog

## [1.0.0] - 2024-03-20
### Added
- Initial release
- Basic governance
- Proposal system

## [1.1.0] - 2024-03-27
### Added
- Proposal previews
- Vote delegation
```

### Deployment

1. Preparation
```bash
# Update version
npm version patch

# Build assets
npm run build

# Run tests
npm run test
```

2. Deployment
```bash
# Deploy contracts
npx hardhat run scripts/deploy.ts --network mainnet

# Deploy frontend
npm run deploy:frontend

# Deploy backend
npm run deploy:backend
```

3. Verification
```bash
# Verify contracts
npx hardhat verify --network mainnet ADDRESS ARGS

# Check deployment
npm run verify:deployment
```

## Community

### Communication Channels

1. Discord
- #development
- #proposals
- #support
- #announcements

2. Forum
- Technical Discussion
- Governance Proposals
- Community Ideas
- Support Questions

3. GitHub
- Issues
- Pull Requests
- Discussions
- Project Boards

### Recognition

1. Contribution Levels
```
Level 1 - Bug fixes, small features
Level 2 - Major features, documentation
Level 3 - Core improvements, security
Level 4 - Architecture, design
```

2. Rewards
```
- ASTRO tokens
- NFT badges
- Role upgrades
- Special access
```

3. Hall of Fame
```
- Top contributors
- Critical fixes
- Major features
- Community leaders
```

## Support

### Getting Help

1. Documentation
- User Guide
- API Reference
- Contributing Guide
- FAQ

2. Community Support
- Discord help
- Forum questions
- GitHub issues
- Community calls

3. Direct Support
- Email support
- Bug reports
- Feature requests
- Security issues

### Reporting Issues

1. Bug Reports
```markdown
## Bug Description
What happened?

## Expected Behavior
What should happen?

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Environment
- OS: Windows 10
- Browser: Chrome 120
- Version: 1.0.0
```

2. Feature Requests
```markdown
## Feature Description
What's needed?

## Use Case
Why is it needed?

## Proposed Solution
How could it work?

## Alternatives
What other options exist?
```

3. Security Issues
```
- Report privately
- Include proof of concept
- Provide environment details
- Suggest fixes if possible
``` 