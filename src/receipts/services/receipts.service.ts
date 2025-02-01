import { Injectable } from '@nestjs/common';

import type { ProcessReceiptDto } from '../dto/process-receipt.dto';
import { ReceiptsRepository } from '../repositories/receipts.in-memory.repository';
import { PointRulesService } from './point-rules.service';

@Injectable()
export class ReceiptsService {
    constructor(
        private readonly receiptsRepository: ReceiptsRepository,
        private readonly pointRulesService: PointRulesService,
    ) {}

    processReceipt(receipt: ProcessReceiptDto): string | undefined {
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
        return this.receiptsRepository.findOne(id);
    }
}
