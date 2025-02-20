import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from 'src/schemas/customer.schema';
import { CreateCustomerDto, MarkPaidDto } from './customerdto/customer.dto';
import { ClientSession, Model, Types } from 'mongoose';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  findById(id: string) {
    return this.customerModel.findById(id).lean().exec();
  }

  findOne(filters: Partial<Customer>) {
    return this.customerModel.findOne(filters).lean().exec();
  }

  async getBulkData(
    limit: number,
    offset: number,
    fields: string[],
  ): Promise<any[]> {
    const selectedFields = fields?.length ? fields.join(' ') : '';

    const query = this.customerModel.find().skip(offset).limit(limit);

    if (selectedFields) {
      query.select(selectedFields);
    }

    return query.exec();
  }

  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    try {
      const newCustomer = new this.customerModel({
        ...createCustomerDto,
        entryDateTime: createCustomerDto.entryDateTime || new Date(), // Defaults to current timestamp
      });
      return await newCustomer.save();
    } catch (error) {
      throw new Error('Error creating customer: ' + error.message);
    }
  }

  async markPaid(id: string, markPaidDto: MarkPaidDto) {
    const { paymentDate } = markPaidDto;
    const paymentDateObj = new Date(paymentDate); // Convert string to Date object

    // Start a MongoDB session
    const session: ClientSession = await this.customerModel.db.startSession();
    session.startTransaction();

    try {
      const customer = await this.customerModel.findById(id).session(session);

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      // Validate that the paymentDate falls within the allowed range
      if (
        paymentDateObj < customer.fromDate ||
        paymentDateObj > customer.toDate
      ) {
        throw new BadRequestException(
          'Payment date is outside the installment period',
        );
      }

      // Extract year and month from paymentDate
      const paymentYear = paymentDateObj.getFullYear();
      const paymentMonth = paymentDateObj.getMonth() + 1; // Months are 0-based

      // Check if an installment for this month & year is already paid
      const existingPayment = customer.paymentHistory.find(
        (payment) =>
          new Date(payment.paymentDate).getFullYear() === paymentYear &&
          new Date(payment.paymentDate).getMonth() + 1 === paymentMonth &&
          payment.paid === true,
      );

      if (existingPayment) {
        await session.abortTransaction();
        session.endSession();
        return { message: 'Installment already paid for this month' };
      }

      // Mark installment as paid
      customer.paymentHistory.push({ paymentDate: paymentDateObj, paid: true });

      // Save the updated customer document
      await customer.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return { message: 'Installment marked as paid successfully' };
    } catch (error) {
      // Rollback on error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
