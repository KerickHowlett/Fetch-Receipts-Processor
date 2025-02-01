import { Test, TestingModule } from '@nestjs/testing';

import { RECEIPT_NOT_FOUND_EXCEPTION } from '../constants/receipts.const';
import type { ProcessItemDto } from '../dto/process-item.dto';
import { ProcessReceiptDto } from '../dto/process-receipt.dto';
import { ReceiptsService } from '../services/receipts.service';
import { ReceiptsController } from './receipts.controller';

const MOCK_SCORE = 100;
const MOCK_RECEIPT_ID = 'RECEIPT_ID' as const;
const MOCK_ITEM: ProcessItemDto = {
    shortDescription: 'Gatorade',
    price: 2.25,
} as const;
const MOCK_RECEIPT: ProcessReceiptDto = {
    retailer: 'M&M Corner Market',
    purchaseDate: '2022-03-20',
    purchaseTime: '14:33',
    items: [MOCK_ITEM, MOCK_ITEM, MOCK_ITEM, MOCK_ITEM],
    total: 9.0,
} as const;

class MockReceiptService {
    processReceipt(_createReceiptDto: ProcessReceiptDto): string {
        return MOCK_RECEIPT_ID;
    }

    findScoreById(id: string): number | undefined {
        return id === MOCK_RECEIPT_ID ? MOCK_SCORE : undefined;
    }
}

describe('ReceiptsController', () => {
    let controller: ReceiptsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReceiptsController],
            providers: [{ provide: ReceiptsService, useClass: MockReceiptService }],
        }).compile();

        controller = module.get<ReceiptsController>(ReceiptsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('processReceipt', () => {
        it('should process a receipt', () => {
            const response = controller.processReceipt(MOCK_RECEIPT);
            expect(response).toStrictEqual({ id: MOCK_RECEIPT_ID });
        });
    });

    describe('getPointsAwarded', () => {
        it('should get points awarded', () => {
            const response = controller.getPointsAwarded(MOCK_RECEIPT_ID);
            expect(response).toStrictEqual({ points: MOCK_SCORE });
        });

        it('should throw error if receipt not found', () => {
            expect(() => controller.getPointsAwarded('NOT_FOUND')).toThrow(
                RECEIPT_NOT_FOUND_EXCEPTION,
            );
        });
    });
});
