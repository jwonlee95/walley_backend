import { Document } from 'mongoose';

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

interface ISubscription extends Document {
    amount: number;
    recurDate: Date;
    description: string;
}
export { IExpense, IIncome, IUser, ISubscription };
