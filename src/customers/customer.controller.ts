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
  GetCustomerDto,
  MarkPaidDto,
  UpdateCustomerDto,
} from './customerdto/customer.dto';

@ApiTags('Customer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post(':id/mark-paid')
  async markPaid(@Param('id') id: string, @Body() markPaidDto: MarkPaidDto) {
    return this.customersService.markPaid(id, markPaidDto);
  }

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

  @Put('/:id')
  updateOrganizationById(
    @Param() params: GetCustomerDto,
    @Body() body: UpdateCustomerDto,
  ) {
    return this.customersService.update(params.id, body);
  }

  @Delete('delete/:id')
  deleteCustomerById(@Param() params: GetCustomerDto) {
    return this.customersService.delete(params.id);
  }

  @Post()
  async createCustomer(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    createCustomerDto: CreateCustomerDto,
  ) {
    const customer = await this.customersService.createCustomer(
      createCustomerDto,
    );
    return customer;
  }
}
