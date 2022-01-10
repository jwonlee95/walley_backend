import { Document } from 'mongoose';

interface IBook extends Document {
    title: string;
    author: string;
    extraInformation: string;
}

interface IExpense extends Document {
    category: string;
    user: IUser;
    description?: string;
    amount: number;
    balance: number;
}

interface IIncome extends Document {
    category: string;
    user: IUser;
    description?: string;
    amount: number;
    balance: number;
}

interface IUser extends Document {
    uid: string;
    name: string;
    expense: IExpense;
    income: IIncome;
    balace: number;
}

export { IBook, IExpense, IIncome, IUser };
