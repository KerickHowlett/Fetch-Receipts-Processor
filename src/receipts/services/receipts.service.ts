import { Injectable } from '@nestjs/common';

import type { ProcessReceiptDto } from '../dto/process-receipt.dto';
import { ReceiptsRepository } from '../repositories/receipts.in-memory.repository';
import { PointsService } from './points.service';

@Injectable()
export class ReceiptsService {
    constructor(
        private readonly receiptsRepository: ReceiptsRepository,
        private readonly pointsService: PointsService,
    ) {}

    processReceipt(receipt: ProcessReceiptDto): string | undefined {
        let points = 0;

        points += this.pointsService.applyRetailerNameAlphaNumCharsRule(receipt.retailer);
        points += this.pointsService.applyRoundDollarAmountRule(receipt.total);
        points += this.pointsService.applyCleanQuarterDividendRule(receipt.total);
        points += this.pointsService.applyItemPairsRule(receipt.items);
        points += this.pointsService.applyItemDescriptionsLengthRule(receipt.items);
        points += this.pointsService.applyPurchaseDateDayRule(receipt.purchaseDate);
        points += this.pointsService.applyPurchaseTimeRangeRule(receipt.purchaseTime);

        return this.receiptsRepository.create(points);
    }

    findScoreById(id: string): number | undefined {
        return this.receiptsRepository.findOne(id);
    }
}
