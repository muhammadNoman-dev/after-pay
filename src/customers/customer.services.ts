import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from 'src/schemas/customer.schema';
import { CreateCustomerDto } from './customerdto/customer.dto';
import { Model, Types } from 'mongoose';

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
}
