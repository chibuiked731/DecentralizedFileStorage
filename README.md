# Decentralized File Storage

This project implements a decentralized file storage system using Clarity smart contracts and the Clarinet development framework. The application includes the following components:

1. File Encryption and Access Control
2. Storage Provider Incentives
3. Integration with Existing Stacks Storage Solutions

## Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet)
- [Node.js](https://nodejs.org/)

## Setup

1. Clone the repository:

git clone [https://github.com/yourusername/decentralized-file-storage.git](https://github.com/yourusername/decentralized-file-storage.git)
cd decentralized-file-storage

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

### File Management

The `file-management` contract handles file operations and access control:
- Upload new files
- Grant and revoke access to files
- Delete files
- Check file access permissions

### Storage Provider Incentives

The `storage-provider-incentives` contract manages incentives for storage providers:
- Stake tokens as a storage provider
- Reward storage providers for storing files
- Claim rewards
- Unstake tokens

### Stacks Storage Integration

The `stacks-storage-integration` contract integrates with existing Stacks storage solutions:
- Register and update Gaia hub information
- Store file references in Gaia

## Testing

Each contract has its own test file in the `tests` directory. You can run all tests using the `clarinet test` command.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
```
