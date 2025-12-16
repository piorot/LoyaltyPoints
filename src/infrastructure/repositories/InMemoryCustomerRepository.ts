import { CustomerRepository } from '../../domain/repositories/CustomerRepository';
import { Customer } from '../../domain/entities/Customer';
import { CustomerId } from '../../domain/value-objects/CustomerId';

export class InMemoryCustomerRepository implements CustomerRepository {
  private customers: Map<string, Customer> = new Map();

  findById(id: CustomerId): Customer | null {
    return this.customers.get(id.getValue()) || null;
  }

  save(customer: Customer): void {
    this.customers.set(customer.getId().getValue(), customer);
  }
}
