import { RedeemPointsUseCase } from '../RedeemPointsUseCase';
import { CustomerRepository } from '../../../domain/repositories/CustomerRepository';
import { LowBalanceNotifier } from '../../ports/LowBalanceNotifier';
import { Customer } from '../../../domain/entities/Customer';
import { CustomerId } from '../../../domain/value-objects/CustomerId';
import { Points } from '../../../domain/value-objects/Points';

class MockCustomerRepository implements CustomerRepository {
  private customers = new Map<string, Customer>();

  findById(id: CustomerId): Customer | null {
    return this.customers.get(id.getValue()) || null;
  }

  save(customer: Customer): void {
    this.customers.set(customer.getId().getValue(), customer);
  }

  addCustomer(customer: Customer): void {
    this.customers.set(customer.getId().getValue(), customer);
  }
}

class MockLowBalanceNotifier implements LowBalanceNotifier {
  public notifiedCustomers: Array<{ customerId: string; balance: number }> = [];

  notify(customerId: CustomerId, balance: Points): void {
    this.notifiedCustomers.push({
      customerId: customerId.getValue(),
      balance: balance.getValue(),
    });
  }
}

describe('RedeemPointsUseCase', () => {
  let repository: MockCustomerRepository;
  let notifier: MockLowBalanceNotifier;
  let useCase: RedeemPointsUseCase;

  beforeEach(() => {
    repository = new MockCustomerRepository();
    notifier = new MockLowBalanceNotifier();
    useCase = new RedeemPointsUseCase(repository, notifier);
  });

  it('should redeem points successfully when sufficient balance', () => {
    const customerId = CustomerId.create('user123');
    const customer = Customer.create(customerId, Points.create(100));
    repository.addCustomer(customer);

    useCase.execute(customerId, Points.create(50));

    const updatedCustomer = repository.findById(customerId);
    expect(updatedCustomer?.getBalance().getValue()).toBe(50);
  });

  it('should throw error when customer not found', () => {
    const customerId = CustomerId.create('unknown');

    expect(() => {
      useCase.execute(customerId, Points.create(50));
    }).toThrow('Customer unknown not found');
  });

  it('should throw error when insufficient balance', () => {
    const customerId = CustomerId.create('user123');
    const customer = Customer.create(customerId, Points.create(20));
    repository.addCustomer(customer);

    expect(() => {
      useCase.execute(customerId, Points.create(50));
    }).toThrow('Insufficient balance');
  });

  it('should not modify balance when insufficient balance', () => {
    const customerId = CustomerId.create('user123');
    const customer = Customer.create(customerId, Points.create(20));
    repository.addCustomer(customer);

    try {
      useCase.execute(customerId, Points.create(50));
    } catch (e) {}

    const updatedCustomer = repository.findById(customerId);
    expect(updatedCustomer?.getBalance().getValue()).toBe(20);
  });

  it('should notify when balance drops below 10', () => {
    const customerId = CustomerId.create('user123');
    const customer = Customer.create(customerId, Points.create(15));
    repository.addCustomer(customer);

    useCase.execute(customerId, Points.create(10));

    expect(notifier.notifiedCustomers).toHaveLength(1);
    expect(notifier.notifiedCustomers[0].customerId).toBe('user123');
    expect(notifier.notifiedCustomers[0].balance).toBe(5);
  });

  it('should not notify when balance remains at or above 10', () => {
    const customerId = CustomerId.create('user123');
    const customer = Customer.create(customerId, Points.create(50));
    repository.addCustomer(customer);

    useCase.execute(customerId, Points.create(30));

    expect(notifier.notifiedCustomers).toHaveLength(0);
  });
});
