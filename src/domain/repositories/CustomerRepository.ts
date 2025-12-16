import { Customer } from '../entities/Customer';
import { CustomerId } from '../value-objects/CustomerId';

export interface CustomerRepository {
  findById(id: CustomerId): Customer | null;
  save(customer: Customer): void;
}