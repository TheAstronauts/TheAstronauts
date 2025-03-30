# The Astronauts DAO - Smart Contracts Documentation

## Overview

The Astronauts DAO smart contracts implement a comprehensive governance system with secure treasury management and flexible proposal execution. The contracts are written in Solidity and follow best practices for security, gas optimization, and upgradeability.

## Contract Architecture

### Core Contracts

1. **AstronautsToken.sol**
   - ERC20 governance token
   - Implements vote delegation
   - Snapshot mechanism for vote counting
   - Token transfer restrictions

2. **AstronautsGovernor.sol**
   - OpenZeppelin Governor implementation
   - Proposal creation and execution
   - Vote counting and quorum
   - Timelock integration

3. **AstronautsTreasury.sol**
   - Multi-signature wallet
   - Token management
   - Spending limits
   - Emergency recovery

### Supporting Contracts

1. **ProposalValidator.sol**
   - Action validation
   - Parameter bounds checking
   - Signature verification
   - Gas estimation

2. **VotingStrategy.sol**
   - Token-weighted voting
   - Delegation tracking
   - Vote power calculation
   - Quorum determination

3. **TimelockController.sol**
   - Execution delay
   - Cancel/schedule operations
   - Role management
   - Emergency procedures

## Contract Interfaces

### AstronautsToken

```solidity
interface IAstronautsToken {
    /// @notice Total token supply
    function totalSupply() external view returns (uint256);
    
    /// @notice Token balance of an account
    function balanceOf(address account) external view returns (uint256);
    
    /// @notice Transfer tokens to a recipient
    function transfer(address to, uint256 amount) external returns (bool);
    
    /// @notice Approve spender to transfer tokens
    function approve(address spender, uint256 amount) external returns (bool);
    
    /// @notice Get current votes for an account
    function getVotes(address account) external view returns (uint256);
    
    /// @notice Delegate votes to an account
    function delegate(address delegatee) external;
    
    /// @notice Get past votes at a specific block
    function getPastVotes(address account, uint256 blockNumber) 
        external view returns (uint256);
}
```

### AstronautsGovernor

```solidity
interface IAstronautsGovernor {
    /// @notice Create a new proposal
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256);
    
    /// @notice Cast a vote on a proposal
    function castVote(
        uint256 proposalId,
        uint8 support,
        string memory reason
    ) external returns (uint256);
    
    /// @notice Execute a successful proposal
    function execute(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) external payable returns (uint256);
    
    /// @notice Get proposal state
    function state(uint256 proposalId) 
        external view returns (ProposalState);
}
```

### AstronautsTreasury

```solidity
interface IAstronautsTreasury {
    /// @notice Execute a transaction
    function executeTransaction(
        address target,
        uint256 value,
        bytes memory data,
        bytes memory signatures
    ) external returns (bytes memory);
    
    /// @notice Get required signatures
    function required() external view returns (uint256);
    
    /// @notice Check if account is signer
    function isSigner(address account) external view returns (bool);
    
    /// @notice Get transaction hash
    function getTransactionHash(
        address target,
        uint256 value,
        bytes memory data,
        uint256 nonce
    ) external pure returns (bytes32);
}
```

## Events

### Token Events

```solidity
/// @notice Emitted when votes are delegated
event DelegateChanged(
    address indexed delegator,
    address indexed fromDelegate,
    address indexed toDelegate
);

/// @notice Emitted when delegation amount changes
event DelegateVotesChanged(
    address indexed delegate,
    uint256 previousBalance,
    uint256 newBalance
);
```

### Governance Events

```solidity
/// @notice Emitted when a proposal is created
event ProposalCreated(
    uint256 indexed proposalId,
    address proposer,
    address[] targets,
    uint256[] values,
    bytes[] calldatas,
    string description
);

/// @notice Emitted when a vote is cast
event VoteCast(
    address indexed voter,
    uint256 indexed proposalId,
    uint8 support,
    uint256 weight,
    string reason
);
```

### Treasury Events

```solidity
/// @notice Emitted when a transaction is executed
event TransactionExecuted(
    address indexed target,
    uint256 value,
    bytes data,
    bytes signatures
);

/// @notice Emitted when signers are updated
event SignersUpdated(
    address[] signers,
    uint256 required
);
```

## Security Features

### Access Control

1. **Role-Based Access**
   ```solidity
   bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
   bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
   bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
   ```

2. **Timelock Delay**
   ```solidity
   uint256 public constant MIN_DELAY = 1 days;
   uint256 public constant MAX_DELAY = 30 days;
   ```

3. **Voting Thresholds**
   ```solidity
   uint256 public constant QUORUM_NUMERATOR = 4;
   uint256 public constant VOTE_PERIOD = 7 days;
   ```

### Emergency Functions

```solidity
/// @notice Emergency pause
function pause() external onlyRole(ADMIN_ROLE);

/// @notice Emergency unpause
function unpause() external onlyRole(ADMIN_ROLE);

/// @notice Emergency token recovery
function recoverERC20(
    address token,
    address to,
    uint256 amount
) external onlyRole(ADMIN_ROLE);
```

## Deployment

### Prerequisites

1. Environment Variables
   ```shell
   PRIVATE_KEY=your_private_key
   INFURA_API_KEY=your_infura_key
   ETHERSCAN_API_KEY=your_etherscan_key
   ```

2. Constructor Parameters
   ```typescript
   const TOKEN_NAME = "Astronauts";
   const TOKEN_SYMBOL = "ASTRO";
   const INITIAL_SUPPLY = ethers.utils.parseEther("10000000");
   const TIMELOCK_DELAY = 86400; // 1 day
   ```

### Deployment Script

```typescript
async function main() {
    // Deploy token
    const Token = await ethers.getContractFactory("AstronautsToken");
    const token = await Token.deploy(TOKEN_NAME, TOKEN_SYMBOL, INITIAL_SUPPLY);
    await token.deployed();
    
    // Deploy timelock
    const Timelock = await ethers.getContractFactory("TimelockController");
    const timelock = await Timelock.deploy(
        TIMELOCK_DELAY,
        [],
        [],
        ethers.constants.AddressZero
    );
    await timelock.deployed();
    
    // Deploy governor
    const Governor = await ethers.getContractFactory("AstronautsGovernor");
    const governor = await Governor.deploy(
        token.address,
        timelock.address
    );
    await governor.deployed();
    
    // Setup roles
    await timelock.grantRole(
        await timelock.PROPOSER_ROLE(),
        governor.address
    );
    await timelock.grantRole(
        await timelock.EXECUTOR_ROLE(),
        governor.address
    );
}
```

## Testing

### Test Coverage

```shell
------------------|----------|----------|----------|----------|
File             |  % Stmts |  % Branch|  % Funcs |  % Lines |
------------------|----------|----------|----------|----------|
 contracts/      |    98.21 |    95.65 |   100.00 |    98.15 |
  Token.sol      |   100.00 |   100.00 |   100.00 |   100.00 |
  Governor.sol   |    97.14 |    93.75 |   100.00 |    97.06 |
  Treasury.sol   |    97.50 |    93.33 |   100.00 |    97.37 |
------------------|----------|----------|----------|----------|
```

### Test Examples

```typescript
describe("AstronautsGovernor", function() {
    it("Should create proposal", async function() {
        const { governor, token, owner } = await loadFixture(deployFixture);
        
        await token.delegate(owner.address);
        
        const tx = await governor.propose(
            [token.address],
            [0],
            [token.interface.encodeFunctionData("mint", [
                owner.address,
                ethers.utils.parseEther("1000")
            ])],
            "Mint tokens"
        );
        
        const receipt = await tx.wait();
        const event = receipt.events?.find(
            e => e.event === "ProposalCreated"
        );
        
        expect(event).to.not.be.undefined;
        expect(await governor.state(event.args.proposalId))
            .to.equal(0); // Pending
    });
});
```

## Gas Optimization

### Storage Patterns

```solidity
/// @dev Pack variables into same storage slot
contract GasOptimized {
    // Slot 0: 20 + 1 + 1 = 22 bytes
    address public owner;     // 20 bytes
    bool public paused;      // 1 byte
    uint8 public version;    // 1 byte
    
    // Slot 1: 32 bytes
    uint256 public value;    // 32 bytes
}
```

### Function Optimization

```solidity
/// @dev Use calldata for read-only arrays
function processArray(
    uint256[] calldata data
) external pure returns (uint256) {
    uint256 sum;
    for (uint256 i; i < data.length; ++i) {
        sum += data[i];
    }
    return sum;
}

/// @dev Short circuit to save gas
function complexOperation(
    uint256 a,
    uint256 b
) external view returns (uint256) {
    if (a == 0 || b == 0) return 0;
    return complexCalculation(a, b);
}
```

## Upgrade Pattern

### Transparent Proxy

```solidity
contract AstronautsTokenProxy is TransparentUpgradeableProxy {
    constructor(
        address logic,
        address admin,
        bytes memory data
    ) TransparentUpgradeableProxy(logic, admin, data) {}
}
```

### Implementation Contract

```solidity
contract AstronautsTokenV1 is Initializable {
    function initialize(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) public initializer {
        __ERC20_init(name, symbol);
        _mint(msg.sender, initialSupply);
    }
}
```

## Auditing Checklist

1. **Access Control**
   - [ ] Role-based permissions
   - [ ] Function modifiers
   - [ ] Admin capabilities

2. **Token Security**
   - [ ] Transfer restrictions
   - [ ] Approve/TransferFrom
   - [ ] Token recovery

3. **Governance Safety**
   - [ ] Proposal validation
   - [ ] Vote counting
   - [ ] Execution delay

4. **Treasury Protection**
   - [ ] Multi-sig requirements
   - [ ] Spending limits
   - [ ] Emergency procedures

## Known Issues

1. **Gas Limitations**
   - Proposal execution may fail if actions are too gas intensive
   - Solution: Split into multiple proposals

2. **Front-running**
   - Vote transactions can be front-run
   - Impact: Minimal due to voting period

3. **Delegation Complexity**
   - Delegation changes during voting period
   - Solution: Use checkpoints for vote counting 