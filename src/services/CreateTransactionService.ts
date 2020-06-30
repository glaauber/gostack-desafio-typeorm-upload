import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const balance = await transactionsRepository.getBalance();
    if (type === 'outcome' && value > balance.total) {
      throw new AppError('There is not enough balance.');
    }

    const categoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    const categoryObject =
      categoryExists || categoriesRepository.create({ title: category });

    if (!categoryExists) await categoriesRepository.save(categoryObject);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryObject.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
