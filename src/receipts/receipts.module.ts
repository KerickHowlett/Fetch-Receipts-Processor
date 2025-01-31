import { Module } from '@nestjs/common';

import { ReceiptsController } from './controllers/receipts.controller';
import { ReceiptsRepository } from './repositories/receipts.in-memory.repository.repository';
import { PointsService } from './services/points.service';
import { ReceiptsService } from './services/receipts.service';

@Module({
    controllers: [ReceiptsController],
    providers: [ReceiptsService, PointsService, ReceiptsRepository],
})
export class ReceiptsModule {}
