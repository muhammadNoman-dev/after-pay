import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  CNIC: string;

  @Prop({ required: true, unique: true })
  accountNo: string;

  @Prop({ required: true })
  installmentAmount: number;

  @Prop({ required: true, type: Date })
  fromDate: Date;

  @Prop({ required: true, type: Date })
  toDate: Date;

  @Prop({ required: true, enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'] })
  installmentFrequency: string;

  @Prop({ default: Date.now }) // Defaults to the current timestamp
  entryDateTime: Date;

  @Prop({ type: [{ paymentDate: Date, paid: Boolean }], default: [] })
  paymentHistory: { paymentDate: Date; paid: boolean }[];
}

export type CustomerDocument = Customer & Document;
export const CustomerSchema = SchemaFactory.createForClass(Customer);
