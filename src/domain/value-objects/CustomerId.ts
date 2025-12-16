import { InvalidCustomerIdError } from '../errors/DomainErrors';

export class CustomerId {
  private constructor(private readonly value: string) {}

  static create(value: string): CustomerId {
    if (!value || value.trim().length === 0) {
      throw new InvalidCustomerIdError('Customer ID cannot be empty');
    }
    return new CustomerId(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: CustomerId): boolean {
    return this.value === other.value;
  }
}