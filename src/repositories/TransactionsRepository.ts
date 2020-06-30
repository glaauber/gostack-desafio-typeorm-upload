import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const incomeTransactions = transactions.filter(
      transaction => transaction.type === 'income',
    );

    const outcomeTransactions = transactions.filter(
      transaction => transaction.type === 'outcome',
    );

    const sumValues = (sum: number, { value }: Transaction): number =>
      value + sum;

    const income = incomeTransactions.reduce(sumValues, 0);
    const outcome = outcomeTransactions.reduce(sumValues, 0);
    const total = income - outcome;

    const balance: Balance = {
      income,
      outcome,
      total,
    };
    return balance;
  }
}

export default TransactionsRepository;
