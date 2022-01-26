import mongoose, { Schema } from 'mongoose';
import { ICategory } from '../interfaces';

const CategorySchema: Schema = new Schema(
    {
        icon: { type: String, required: true },
        color: { type: String, required: true },
        name: { type: String, required: true },
        budget: { type: Number, required: true, default: 0 },
        remain: { type: Number, default: 0 },
        spent: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ICategory>('Category', CategorySchema);
