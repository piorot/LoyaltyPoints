import { DomainEvent } from './DomainEvent';
import { CustomerId } from '../value-objects/CustomerId';
import { Points } from '../value-objects/Points';

export class LowBalanceDetected implements DomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly customerId: CustomerId,
    public readonly balance: Points
  ) {
    this.occurredAt = new Date();
  }
}
