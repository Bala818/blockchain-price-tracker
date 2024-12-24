import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PriceService } from './price.service';
import { Repository, LessThanOrEqual } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from './entities/Price.entity';
import { EmailService } from './email.service';

@Injectable()
export class PriceFetchTask {
    constructor(
        private readonly priceService: PriceService,
        private readonly emailService: EmailService,
        @InjectRepository(Price)
        private readonly priceRepository: Repository<Price>,
    ) { }

    @Cron('*/5 * * * *') // Every 5 minutes
    async fetchAndSavePrices() {
        const chains = ['ethereum', 'polygon'];
        for (const chain of chains) {
            try {
                // Fetch current price
                const price = await this.priceService.getChainPrice(chain);

                // Save current price to the database
                await this.priceRepository.save({ chain, price });
                console.log(`Saved price for ${chain}: $${price}`);

                // Fetch price from 1 hour ago
                const oneHourAgo = new Date();
                oneHourAgo.setHours(oneHourAgo.getHours() - 1);

                const oldPrice = await this.priceRepository.findOne({
                    where: {
                        chain,
                        timestamp: LessThanOrEqual(oneHourAgo),
                    },
                    order: { timestamp: 'DESC' },
                });

                if (oldPrice) {
                    const priceIncrease = ((price - oldPrice.price) / oldPrice.price) * 100;
                    if (priceIncrease > 3) {
                        // Send alert email
                        await this.emailService.sendAlertEmail(
                            'hyperhire_assignment@hyperhire.in',
                            `Price Alert for ${chain}`,
                            `The price of ${chain} has increased by ${priceIncrease.toFixed(2)}% in the last hour. Current price: $${price}.`
                        );
                    }
                }
            } catch (error) {
                console.error(`Failed to fetch/save price for ${chain}:`, error.message);
            }
        }
    }
}
