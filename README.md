# Governance DAO

This project implements a simple Governance DAO (Decentralized Autonomous Organization) using Clarity smart contracts and the Clarinet development framework. The application includes the following components:

1. DAO Core (Membership management)
2. Proposal Voting
3. Treasury Management

## Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet)
- [Node.js](https://nodejs.org/)

## Setup

1. Clone the repository:

git clone [https://github.com/yourusername/governance-dao.git](https://github.com/yourusername/governance-dao.git)
cd governance-dao

```plaintext

2. Install dependencies:
```

npm install

```plaintext

3. Run tests:
```

clarinet test

```plaintext

## Contracts

### DAO Core

The `dao-core` contract manages DAO membership:
- Join DAO
- Leave DAO
- Check membership status

### Proposal Voting

The `proposal-voting` contract handles the proposal and voting system:
- Submit proposals
- Vote on proposals
- Execute approved proposals

### Treasury

The `treasury` contract manages the DAO's funds:
- Deposit funds
- Transfer funds (only through executed proposals)

## Testing

Each contract has its own test file in the `tests` directory. You can run all tests using the `clarinet test` command.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
```
