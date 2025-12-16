import { CustomerId } from '../CustomerId';

describe('CustomerId', () => {
  describe('create', () => {
    it('should create customer id with valid value', () => {
      const id = CustomerId.create('user123');
      expect(id.getValue()).toBe('user123');
    });

    it('should trim whitespace from value', () => {
      const id = CustomerId.create('  user123  ');
      expect(id.getValue()).toBe('user123');
    });

    it('should throw error for empty string', () => {
      expect(() => CustomerId.create('')).toThrow('Customer ID cannot be empty');
    });

    it('should throw error for whitespace only string', () => {
      expect(() => CustomerId.create('   ')).toThrow('Customer ID cannot be empty');
    });
  });

  describe('equals', () => {
    it('should return true for same value', () => {
      const id1 = CustomerId.create('user123');
      const id2 = CustomerId.create('user123');
      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false for different values', () => {
      const id1 = CustomerId.create('user123');
      const id2 = CustomerId.create('user456');
      expect(id1.equals(id2)).toBe(false);
    });
  });
});
