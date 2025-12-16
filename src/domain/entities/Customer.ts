import { CustomerId } from '../value-objects/CustomerId';
import { Points } from '../value-objects/Points';
import { DomainEvent } from '../events/DomainEvent';
import { LowBalanceDetected } from '../events/LowBalanceDetected';

export class Customer {
  private domainEvents: DomainEvent[] = [];

  private constructor(
    private readonly id: CustomerId,
    private balance: Points
  ) {}

  static create(id: CustomerId, initialBalance: Points = Points.create(0)): Customer {
    return new Customer(id, initialBalance);
  }

  getId(): CustomerId {
    return this.id;
  }

  getBalance(): Points {
    return this.balance;
  }

  earnPoints(points: Points): void {
    this.balance = this.balance.add(points);
  }

  redeemPoints(points: Points): boolean {
    if (!this.balance.isGreaterThanOrEqual(points)) {
      return false;
    }

    const wasAboveLowBalanceThreshold = !this.balance.isLessThan(10);
    this.balance = this.balance.subtract(points);
    const isNowBelowThreshold = this.balance.isLessThan(10);

    if (wasAboveLowBalanceThreshold && isNowBelowThreshold) {
      this.domainEvents.push(new LowBalanceDetected(this.id, this.balance));
    }

    return true;
  }

  hasLowBalance(): boolean {
    return this.balance.isLessThan(10);
  }

  getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }
}