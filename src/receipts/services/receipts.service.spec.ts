import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import type { ProcessItemDto } from '../dto/process-item.dto';
import type { ProcessReceiptDto } from '../dto/process-receipt.dto';
import { ReceiptsRepository } from '../repositories/receipts.in-memory.repository';
import { PointsService } from './points.service';
import { ReceiptsService } from './receipts.service';

const MOCK_SCORE = 10;
const MOCK_ID = 'ID' as const;

const MOCK_RECEIPT: ProcessReceiptDto = {
    retailer: 'Wall-mart',
    purchaseDate: '2024-01-01',
    purchaseTime: '13:00',
    items: [
        {
            shortDescription: 'Item 4',
            price: 11,
        },
    ],
    total: 15,
} as const;

@Injectable()
class MockPointsService {
    applyRetailerNameAlphaNumCharsRule(_retailer: string): number {
        return 14;
    }

    applyRoundDollarAmountRule(_total: number): number {
        return 50;
    }

    applyCleanQuarterDividendRule(_total: number): number {
        return 25;
    }

    applyItemPairsRule(_items: ProcessItemDto[]): number {
        return 10;
    }

    applyItemDescriptionsLengthRule(_items: ProcessItemDto[]): number {
        return 0;
    }

    applyPurchaseDateDayRule(_purchaseDate: Date): number {
        return 0;
    }

    applyPurchaseTimeRangeRule(_purchaseTime: string): number {
        return 10;
    }
}

@Injectable()
class MockReceiptsRepository {
    create(_receipt: ProcessReceiptDto): string | undefined {
        return MOCK_ID;
    }

    findOne(_id: string): number | undefined {
        return MOCK_SCORE;
    }
}

describe('ReceiptsService', () => {
    let service: ReceiptsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReceiptsService,
                {
                    provide: ReceiptsRepository,
                    useClass: MockReceiptsRepository,
                },
                {
                    provide: PointsService,
                    useClass: MockPointsService,
                },
            ],
        }).compile();

        service = module.get<ReceiptsService>(ReceiptsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createReceipt', () => {
        it('should create a receipt', () => {
            expect(service.processReceipt(MOCK_RECEIPT)).toBe(MOCK_ID);
        });
    });

    describe('getReceipt', () => {
        it('should get a receipt', () => {
            expect(service.findScoreById(MOCK_ID)).toEqual(MOCK_SCORE);
        });
    });
});
