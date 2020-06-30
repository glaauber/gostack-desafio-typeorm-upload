import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(transaction_id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transaction = transactionsRepository.findOne(transaction_id);
    if (!transaction) {
      throw new AppError('Transaction not found.', 400);
    }
    await transactionsRepository.delete({ id: transaction_id });
  }
}

export default DeleteTransactionService;
