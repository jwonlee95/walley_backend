import { Document } from 'mongoose';

interface ITransaction extends Document {
    category: string;
    type: string;
    description: string;
    date: Date;
    amount: number;
    memo?: string;
}

interface IUser extends Document {
    uid: string;
    name: string;
    transaction: ITransaction[];
    balace: number;
    subscription: ISubscription[];
    category: ICategory[];
}

interface ISubscription extends Document {
    amount: number;
    recurDate: Date;
    name: string;
}

interface ICategory extends Document {
    oldName: string;
    oldAmount: number;
    oldSpent: number;
    icon: string;
    color: string;
    name: string;
    budget: number;
    spent: number;
    remain: number;
}
export { ITransaction, IUser, ISubscription, ICategory };
