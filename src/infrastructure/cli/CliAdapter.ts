import { EarnPointsUseCase } from '../../application/use-cases/EarnPointsUseCase';
import { RedeemPointsUseCase } from '../../application/use-cases/RedeemPointsUseCase';
import { CustomerId } from '../../domain/value-objects/CustomerId';
import { Points } from '../../domain/value-objects/Points';

export class CliAdapter {
  constructor(
    private readonly earnPointsUseCase: EarnPointsUseCase,
    private readonly redeemPointsUseCase: RedeemPointsUseCase
  ) {}

  run(args: string[]): void {
    if (args.length < 4) {
      this.printUsage();
      process.exit(1);
    }

    const command = args[2];
    const customerIdValue = args[3];
    const pointsValue = args[4];

    this.executeCommand(command, customerIdValue, pointsValue);
  }

  executeCommand(command: string, customerIdValue: string, pointsValue: string): void {
    try {
      const customerId = CustomerId.create(customerIdValue);
      const points = Points.create(Number(pointsValue));

      switch (command) {
        case 'earn':
          this.earnPointsUseCase.execute(customerId, points);
          console.log(
            `Successfully earned ${points.getValue()} points for customer ${customerId.getValue()}`
          );
          break;

        case 'redeem':
          this.redeemPointsUseCase.execute(customerId, points);
          console.log(
            `Successfully redeemed ${points.getValue()} points for customer ${customerId.getValue()}`
          );
          break;

        default:
          console.error(`Unknown command: ${command}`);
          this.printUsage();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      }
    }
  }

  private printUsage(): void {
    console.log('Usage: node dist/index.js <command> <customerId> <points>');
    console.log('Commands:');
    console.log('  earn <customerId> <points>   - Add points to customer balance');
    console.log('  redeem <customerId> <points> - Redeem points from customer balance');
  }
}
