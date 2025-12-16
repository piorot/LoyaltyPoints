import { InMemoryCustomerRepository } from './infrastructure/repositories/InMemoryCustomerRepository';
import { ConsoleNotifier } from './infrastructure/notifiers/ConsoleNotifier';
import { EarnPointsUseCase } from './application/use-cases/EarnPointsUseCase';
import { RedeemPointsUseCase } from './application/use-cases/RedeemPointsUseCase';
import { CliAdapter } from './infrastructure/cli/CliAdapter';
import { ReplAdapter } from './infrastructure/cli/ReplAdapter';

const customerRepository = new InMemoryCustomerRepository();
const lowBalanceNotifier = new ConsoleNotifier();

const earnPointsUseCase = new EarnPointsUseCase(customerRepository);
const redeemPointsUseCase = new RedeemPointsUseCase(customerRepository, lowBalanceNotifier);

const cliAdapter = new CliAdapter(earnPointsUseCase, redeemPointsUseCase);

if (process.argv.length > 2) {
  cliAdapter.run(process.argv);
} else {
  const replAdapter = new ReplAdapter(cliAdapter);
  replAdapter.start();
}
