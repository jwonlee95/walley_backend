import { Document } from 'mongoose';

interface IBook extends Document {
    title: string;
    author: string;
    extraInformation: string;
}

interface IExpense extends Document {
    category: string;
    description: string;
    amount: number;
    balance: number;
}

interface IIncome {
    category: string;
    description: string;
    amount: string;
    balance: string;
}

interface ISubscription {
    name: string;
    recurDate: Date;
    amount: string;
}

export { IBook, IExpense };
