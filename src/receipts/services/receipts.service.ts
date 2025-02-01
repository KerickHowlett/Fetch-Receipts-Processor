import { Injectable, Logger } from '@nestjs/common';

import type { ProcessReceiptDto } from '../dto/process-receipt.dto';
import { ReceiptsRepository } from '../repositories/receipts.in-memory.repository';
import { PointRulesService } from './point-rules.service';

@Injectable()
export class ReceiptsService {
    constructor(
        private readonly receiptsRepository: ReceiptsRepository,
        private readonly pointRulesService: PointRulesService,
    ) {}

    processReceipt(receipt: ProcessReceiptDto): string {
        let points = 0;

        points += this.pointRulesService.applyRetailerNameAlphaNumCharsRule(receipt.retailer);
        points += this.pointRulesService.applyRoundDollarAmountRule(receipt.total);
        points += this.pointRulesService.applyCleanQuarterDividendRule(receipt.total);
        points += this.pointRulesService.applyItemPairsRule(receipt.items);
        points += this.pointRulesService.applyItemDescriptionsLengthRule(receipt.items);
        points += this.pointRulesService.applyPurchaseDateDayRule(receipt.purchaseDate);
        points += this.pointRulesService.applyPurchaseTimeRangeRule(receipt.purchaseTime);

        return this.receiptsRepository.create(points);
    }

    findScoreById(id: string): number | undefined {
        const score = this.receiptsRepository.findOne(id);

        if (score === undefined) {
            Logger.warn("receipt's awarded points were not found", id);
        }

        return score;
    }
}
