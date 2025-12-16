# Customer Loyalty Points System

![Tests](https://github.com/piorot/LoyaltyPoints/actions/workflows/test.yml/badge.svg)
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/piorot/LoyaltyPoints)

A command-line application to manage customer loyalty points.

## Requirements

The application supports two main operations:

1. `earn <customerId> <points>` - Adds points to a customer's balance
2. `redeem <customerId> <points>` - Redeems points from a customer's balance

### Business Rules

- Customers are identified by a simple string (customerId)
- A customer cannot redeem more points than they have in their balance
- If a customer's balance drops below 10 points after redemption, a warning is triggered

## Usage

Build the project:
```bash
npm install
npm run build
```

Run in interactive mode:
```bash
node dist/index.js
```

Or run single commands:
```bash
node dist/index.js earn "user123" 100
node dist/index.js redeem "user123" 50
```

## Testing

```bash
npm test
```
