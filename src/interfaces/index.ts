import { Document } from 'mongoose';

interface IExpense extends Document {
    category: string;
    description?: string;
    amount: number;
    updatedAt: Date;
}

interface IIncome extends Document {
    category: string;
    description?: string;
    amount: number;
    updatedAt: Date;
}

interface IUser extends Document {
    uid: string;
    name: string;

    expense: IExpense[];
    income: IIncome[];
    balace: number;
    subscription: ISubscription[];
    expenseCategory: ICategory[];
    incomeCategory: ICategory[];
}

interface ISubscription extends Document {
    amount: number;
    recurDate: Date;
    name: string;
}

interface ICategory extends Document {
    oldName: string;
    icon: string;
    color: string;
    name: string;
    budget: number;
    spent: number;
    remain: number;
}
export { IExpense, IIncome, IUser, ISubscription, ICategory };
