import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from './entities/Price.entity';
import { PriceService } from './price.service';

@ApiTags('Prices')
@Controller('prices')
export class PriceController {
    constructor(
        @InjectRepository(Price)
        private readonly priceRepository: Repository<Price>,
        private readonly priceService: PriceService,
    ) { }

    @Get('hourly')
    @ApiOperation({ summary: 'Get hourly prices for the past 24 hours' })
    async getHourlyPrices(@Query('chain') chain: string) {
        const now = new Date();
        const oneDayAgo = new Date();
        oneDayAgo.setHours(now.getHours() - 24);

        return this.priceRepository.find({
            where: {
                chain,
                timestamp: MoreThanOrEqual(oneDayAgo),
            },
            order: { timestamp: 'DESC' },
        });
    }

    @Get('swap-rate')
    @ApiOperation({ summary: 'Get swap rate from ETH to BTC and fees' })
    async getSwapRate(@Query('ethAmount') ethAmount: number) {
        if (!ethAmount || ethAmount <= 0) {
            throw new Error('Invalid Ethereum amount');
        }
        return this.priceService.calculateSwapRate(ethAmount);
    }
}
