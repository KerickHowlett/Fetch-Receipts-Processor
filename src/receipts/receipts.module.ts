import { Module } from '@nestjs/common';

import { ReceiptsController } from './controllers/receipts.controller';
import { ReceiptsRepository } from './repositories/receipts.in-memory.repository';
import { PointRulesService } from './services/point-rules.service';
import { ReceiptsService } from './services/receipts.service';

@Module({
    controllers: [ReceiptsController],
    providers: [ReceiptsService, PointRulesService, ReceiptsRepository],
})
export class ReceiptsModule {}
