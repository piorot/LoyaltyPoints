import { CustomerId } from '../../domain/value-objects/CustomerId';
import { Points } from '../../domain/value-objects/Points';

export interface LowBalanceNotifier {
  notify(customerId: CustomerId, balance: Points): void;
}