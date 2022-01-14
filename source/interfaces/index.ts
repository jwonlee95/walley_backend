import { Document } from 'mongoose';

interface IExpense extends Document {
    category: string;
    description?: string;
    amount: number;
}

interface IIncome extends Document {
    category: string;
    description?: string;
    amount: number;
}

interface IUser extends Document {
    uid: string;
    name: string;
    expense: IExpense[];
    income: IIncome[];
    balace: number;
    subscription: ISubscription[];
    expenseTypes: ITypes[];
    incomeTypes: ITypes[];
}

interface ISubscription extends Document {
    amount: number;
    recurDate: Date;
    description: string;
}

interface ITypes extends Document {
    name: string;
    budget: number;
    spent: number;
    remain: number;
}
export { IExpense, IIncome, IUser, ISubscription, ITypes };
