import {
  Body,
  Param,
  Controller,
  Get,
  Post,
  Delete,
  UseGuards,
  Put,
  Query,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CustomersService } from './customer.services';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateCustomerDto,
  GetBulkDataDto,
  UpdateCustomerDto,
} from './customerdto/customer.dto';

@ApiTags('Customer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('getbulk-data')
  async getBulkData(
    @Query(new ValidationPipe({ transform: true })) query: GetBulkDataDto,
  ) {
    const limitNum = query.limit ? parseInt(query.limit, 10) : 10; // Default: 10
    const offsetNum = query.offset ? parseInt(query.offset, 10) : 0; // Default: 0
    const fieldList = query.fields ? query.fields.split(',') : []; // Default: Return all fields

    return await this.customersService.getBulkData(
      limitNum,
      offsetNum,
      fieldList,
    );
  }

  @Post()
  async createCustomer(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    createCustomerDto: CreateCustomerDto,
  ) {
    try {
      const customer = await this.customersService.createCustomer(
        createCustomerDto,
      );
      return {
        success: true,
        message: 'Customer created successfully',
        data: customer,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to create customer',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
