export class InvalidCustomerIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCustomerIdError';
  }
}

export class InvalidPointsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPointsError';
  }
}

export class InsufficientBalanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InsufficientBalanceError';
  }
}

export class CustomerNotFoundError extends Error {
  constructor(customerId: string) {
    super(`Customer ${customerId} not found`);
    this.name = 'CustomerNotFoundError';
  }
}
