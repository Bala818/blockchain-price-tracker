import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from './entities/Alert.entity';

class CreateAlertDto {
    chain: string;
    targetPrice: number;
    email: string;
}

@ApiTags('Alerts')
@Controller('alerts')
export class AlertController {
    constructor(
        @InjectRepository(Alert)
        private readonly alertRepository: Repository<Alert>,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Set an alert for a specific price' })
    async createAlert(@Body() createAlertDto: CreateAlertDto) {
        const alert = this.alertRepository.create(createAlertDto);
        return this.alertRepository.save(alert);
    }
}
