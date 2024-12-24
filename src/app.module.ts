import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Price } from './entities/Price.entity';
import { Alert } from './entities/Alert.entity';
import { PriceService } from './price.service';
import { PriceFetchTask } from './price-fetch.task';
import { EmailService } from './email.service';
import { PriceController } from './price.controller';
import { AlertController } from './alert.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'price_tracker',
      entities: [Price, Alert],
      synchronize: true,
      logging: true, // Enable SQL query logging
    }),
    TypeOrmModule.forFeature([Price, Alert]),
  ],
  controllers: [
    AppController,
    PriceController,
    AlertController,
  ],
  providers: [
    AppService,
    PriceService,
    PriceFetchTask,
    EmailService,
  ],
})
export class AppModule { }
