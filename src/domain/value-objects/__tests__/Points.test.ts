import { Points } from '../Points';

describe('Points', () => {
  describe('create', () => {
    it('should create points with valid positive value', () => {
      const points = Points.create(100);
      expect(points.getValue()).toBe(100);
    });

    it('should create points with zero value', () => {
      const points = Points.create(0);
      expect(points.getValue()).toBe(0);
    });

    it('should throw error for negative value', () => {
      expect(() => Points.create(-10)).toThrow('Points cannot be negative');
    });

    it('should throw error for non-integer value', () => {
      expect(() => Points.create(10.5)).toThrow('Points must be an integer');
    });
  });

  describe('add', () => {
    it('should add two points correctly', () => {
      const points1 = Points.create(50);
      const points2 = Points.create(30);
      const result = points1.add(points2);
      expect(result.getValue()).toBe(80);
    });

    it('should not mutate original points', () => {
      const points1 = Points.create(50);
      const points2 = Points.create(30);
      points1.add(points2);
      expect(points1.getValue()).toBe(50);
    });
  });

  describe('subtract', () => {
    it('should subtract two points correctly', () => {
      const points1 = Points.create(50);
      const points2 = Points.create(30);
      const result = points1.subtract(points2);
      expect(result.getValue()).toBe(20);
    });

    it('should throw error when result would be negative', () => {
      const points1 = Points.create(30);
      const points2 = Points.create(50);
      expect(() => points1.subtract(points2)).toThrow('Points cannot be negative');
    });

    it('should not mutate original points', () => {
      const points1 = Points.create(50);
      const points2 = Points.create(30);
      points1.subtract(points2);
      expect(points1.getValue()).toBe(50);
    });
  });

  describe('isGreaterThanOrEqual', () => {
    it('should return true when greater', () => {
      const points1 = Points.create(50);
      const points2 = Points.create(30);
      expect(points1.isGreaterThanOrEqual(points2)).toBe(true);
    });

    it('should return true when equal', () => {
      const points1 = Points.create(50);
      const points2 = Points.create(50);
      expect(points1.isGreaterThanOrEqual(points2)).toBe(true);
    });

    it('should return false when less', () => {
      const points1 = Points.create(30);
      const points2 = Points.create(50);
      expect(points1.isGreaterThanOrEqual(points2)).toBe(false);
    });
  });

  describe('isLessThan', () => {
    it('should return true when less than threshold', () => {
      const points = Points.create(5);
      expect(points.isLessThan(10)).toBe(true);
    });

    it('should return false when equal to threshold', () => {
      const points = Points.create(10);
      expect(points.isLessThan(10)).toBe(false);
    });

    it('should return false when greater than threshold', () => {
      const points = Points.create(15);
      expect(points.isLessThan(10)).toBe(false);
    });
  });
});
