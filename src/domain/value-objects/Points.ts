import { InvalidPointsError } from '../errors/DomainErrors';

export class Points {
  private constructor(private readonly value: number) {}

  static create(value: number): Points {
    if (!Number.isInteger(value)) {
      throw new InvalidPointsError('Points must be an integer');
    }
    if (value < 0) {
      throw new InvalidPointsError('Points cannot be negative');
    }
    return new Points(value);
  }

  getValue(): number {
    return this.value;
  }

  add(other: Points): Points {
    return Points.create(this.value + other.value);
  }

  subtract(other: Points): Points {
    return Points.create(this.value - other.value);
  }

  isGreaterThanOrEqual(other: Points): boolean {
    return this.value >= other.value;
  }

  isLessThan(threshold: number): boolean {
    return this.value < threshold;
  }
}