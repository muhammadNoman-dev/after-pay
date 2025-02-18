import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { CustomersService } from "./customer.services"
import { CustomersController } from "./customer.controller"
import { Customer, CustomerSchema } from "src/schemas/customer.schema"

@Module({
	imports: [MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }])],
	controllers: [CustomersController],
	providers: [CustomersService],
	exports: [CustomersService],
})
export class CustomersModule {}
