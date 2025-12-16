import { CustomerRepository } from '../../domain/repositories/CustomerRepository';
import { CustomerId } from '../../domain/value-objects/CustomerId';
import { Points } from '../../domain/value-objects/Points';
import { LowBalanceNotifier } from '../ports/LowBalanceNotifier';
import { CustomerNotFoundError, InsufficientBalanceError } from '../../domain/errors/DomainErrors';
import { LowBalanceDetected } from '../../domain/events/LowBalanceDetected';

export class RedeemPointsUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly lowBalanceNotifier: LowBalanceNotifier
  ) {}

  execute(customerId: CustomerId, points: Points): void {
    const customer = this.customerRepository.findById(customerId);

    if (!customer) {
      throw new CustomerNotFoundError(customerId.getValue());
    }

    const success = customer.redeemPoints(points);

    if (!success) {
      throw new InsufficientBalanceError('Insufficient balance');
    }

    this.customerRepository.save(customer);

    const events = customer.getDomainEvents();
    customer.clearDomainEvents();

    for (const event of events) {
      if (event instanceof LowBalanceDetected) {
        this.lowBalanceNotifier.notify(event.customerId, event.balance);
      }
    }
  }
}