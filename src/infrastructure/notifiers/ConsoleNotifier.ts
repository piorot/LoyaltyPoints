import { LowBalanceNotifier } from '../../application/ports/LowBalanceNotifier';
import { CustomerId } from '../../domain/value-objects/CustomerId';
import { Points } from '../../domain/value-objects/Points';

export class ConsoleNotifier implements LowBalanceNotifier {
  notify(customerId: CustomerId, balance: Points): void {
    console.log(
      `Warning: Customer ${customerId.getValue()} has a low balance: ${balance.getValue()} points.`
    );
  }
}
