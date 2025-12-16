import { Customer } from '../Customer';
import { CustomerId } from '../../value-objects/CustomerId';
import { Points } from '../../value-objects/Points';
import { LowBalanceDetected } from '../../events/LowBalanceDetected';

describe('Customer', () => {
  describe('create', () => {
    it('should create customer with zero balance by default', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id);
      expect(customer.getBalance().getValue()).toBe(0);
    });

    it('should create customer with initial balance', () => {
      const id = CustomerId.create('user123');
      const initialBalance = Points.create(100);
      const customer = Customer.create(id, initialBalance);
      expect(customer.getBalance().getValue()).toBe(100);
    });
  });

  describe('earnPoints', () => {
    it('should add points to balance', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id);
      customer.earnPoints(Points.create(50));
      expect(customer.getBalance().getValue()).toBe(50);
    });

    it('should accumulate multiple point earnings', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id);
      customer.earnPoints(Points.create(50));
      customer.earnPoints(Points.create(30));
      expect(customer.getBalance().getValue()).toBe(80);
    });
  });

  describe('redeemPoints', () => {
    it('should subtract points from balance when sufficient balance', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id, Points.create(100));
      const success = customer.redeemPoints(Points.create(30));
      expect(success).toBe(true);
      expect(customer.getBalance().getValue()).toBe(70);
    });

    it('should return false when insufficient balance', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id, Points.create(20));
      const success = customer.redeemPoints(Points.create(30));
      expect(success).toBe(false);
    });

    it('should not modify balance when insufficient balance', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id, Points.create(20));
      customer.redeemPoints(Points.create(30));
      expect(customer.getBalance().getValue()).toBe(20);
    });

    it('should allow redeeming exact balance', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id, Points.create(50));
      const success = customer.redeemPoints(Points.create(50));
      expect(success).toBe(true);
      expect(customer.getBalance().getValue()).toBe(0);
    });
  });

  describe('hasLowBalance', () => {
    it('should return true when balance is below 10', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id, Points.create(9));
      expect(customer.hasLowBalance()).toBe(true);
    });

    it('should return true when balance is 0', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id, Points.create(0));
      expect(customer.hasLowBalance()).toBe(true);
    });

    it('should return false when balance is exactly 10', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id, Points.create(10));
      expect(customer.hasLowBalance()).toBe(false);
    });

    it('should return false when balance is above 10', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id, Points.create(15));
      expect(customer.hasLowBalance()).toBe(false);
    });
  });

  describe('redeemPoints - domain events', () => {
    it('should emit LowBalanceDetected event when balance drops below 10', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id, Points.create(15));

      customer.redeemPoints(Points.create(10));

      const events = customer.getDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(LowBalanceDetected);

      const event = events[0] as LowBalanceDetected;
      expect(event.customerId.getValue()).toBe('user123');
      expect(event.balance.getValue()).toBe(5);
    });

    it('should emit LowBalanceDetected event when balance drops to exactly 9', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id, Points.create(10));

      customer.redeemPoints(Points.create(1));

      const events = customer.getDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(LowBalanceDetected);
    });

    it('should NOT emit LowBalanceDetected event when balance remains at or above 10', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id, Points.create(50));

      customer.redeemPoints(Points.create(30));

      const events = customer.getDomainEvents();
      expect(events).toHaveLength(0);
    });

    it('should NOT emit LowBalanceDetected event when balance drops to exactly 10', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id, Points.create(15));

      customer.redeemPoints(Points.create(5));

      const events = customer.getDomainEvents();
      expect(events).toHaveLength(0);
    });

    it('should NOT emit LowBalanceDetected event when redemption fails', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id, Points.create(5));

      customer.redeemPoints(Points.create(10));

      const events = customer.getDomainEvents();
      expect(events).toHaveLength(0);
    });

    it('should NOT emit event when balance was already below 10 before redemption', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id, Points.create(8));

      customer.redeemPoints(Points.create(3));

      const events = customer.getDomainEvents();
      expect(events).toHaveLength(0);
    });

    it('should emit event when balance drops from exactly 10 to below 10', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id, Points.create(10));

      customer.redeemPoints(Points.create(1));

      const events = customer.getDomainEvents();
      expect(events).toHaveLength(1);
    });

    it('should clear domain events after clearDomainEvents is called', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id, Points.create(15));

      customer.redeemPoints(Points.create(10));
      expect(customer.getDomainEvents()).toHaveLength(1);

      customer.clearDomainEvents();
      expect(customer.getDomainEvents()).toHaveLength(0);
    });

    it('should accumulate multiple events from multiple redemptions', () => {
      const id = CustomerId.create('user123');
      const customer = Customer.create(id, Points.create(25));

      customer.redeemPoints(Points.create(10));
      expect(customer.getDomainEvents()).toHaveLength(0);

      customer.redeemPoints(Points.create(10));
      expect(customer.getDomainEvents()).toHaveLength(1);
    });
  });
});
