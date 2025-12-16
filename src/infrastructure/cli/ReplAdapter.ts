import * as readline from 'readline';
import { CliAdapter } from './CliAdapter';

export class ReplAdapter {
  constructor(private readonly cliAdapter: CliAdapter) {}

  start(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> '
    });

    console.log('=== Loyalty Points System ===');
    console.log('Commands:');
    console.log('  earn <customerId> <points>   - Add points to customer balance');
    console.log('  redeem <customerId> <points> - Redeem points from customer balance');
    console.log('  exit                         - Exit the application');
    console.log();

    rl.prompt();

    rl.on('line', (input: string) => {
      const trimmedInput = input.trim();

      if (trimmedInput === 'exit') {
        console.log('Goodbye!');
        rl.close();
        return;
      }

      if (trimmedInput === '') {
        rl.prompt();
        return;
      }

      const args = trimmedInput.split(/\s+/);

      if (args.length < 3) {
        console.error('Error: Invalid command format');
        console.log('Usage: <command> <customerId> <points>');
        rl.prompt();
        return;
      }

      const command = args[0];
      const customerId = args[1];
      const points = args[2];

      this.cliAdapter.executeCommand(command, customerId, points);
      rl.prompt();
    });

    rl.on('close', () => {
      process.exit(0);
    });
  }
}
