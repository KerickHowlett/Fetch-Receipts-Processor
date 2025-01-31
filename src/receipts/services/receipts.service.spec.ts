import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Receipt } from '../models/receipt.model';
import { ReceiptsRepository } from '../repositories/receipts.in-memory.repository';
import { ReceiptsService } from './receipts.service';

const MOCK_ID = 'ID' as const;

const MOCK_RECEIPT: Omit<Receipt, 'id'> = {
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
class MockReceiptsRepository {
    create(_receipt: Omit<Receipt, 'id'>): Receipt['id'] | undefined {
        return MOCK_ID;
    }

    findOne(_id: Receipt['id']): Receipt | undefined {
        return { id: MOCK_ID, ...MOCK_RECEIPT };
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
            ],
        }).compile();

        service = module.get<ReceiptsService>(ReceiptsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createReceipt', () => {
        it('should create a receipt', () => {
            expect(service.createReceipt(MOCK_RECEIPT)).toBe(MOCK_ID);
        });
    });

    describe('getReceipt', () => {
        it('should get a receipt', () => {
            expect(service.findOneReceipt(MOCK_ID)).toStrictEqual({ id: MOCK_ID, ...MOCK_RECEIPT });
        });
    });
});
