import mongoose, { Schema } from 'mongoose';
import { ITypes } from '../interfaces';

const TypesSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        budget: { type: Number, required: true, default: 0 },
        spent: { type: Number, required: true, default: 0 }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ITypes>('Types', TypesSchema);
