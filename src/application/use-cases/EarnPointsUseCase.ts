import { CustomerRepository } from '../../domain/repositories/CustomerRepository';
import { Customer } from '../../domain/entities/Customer';
import { CustomerId } from '../../domain/value-objects/CustomerId';
import { Points } from '../../domain/value-objects/Points';

export class EarnPointsUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  execute(customerId: CustomerId, points: Points): void {
    let customer = this.customerRepository.findById(customerId);

    if (!customer) {
      customer = Customer.create(customerId);
    }

    customer.earnPoints(points);
    this.customerRepository.save(customer);
  }
}