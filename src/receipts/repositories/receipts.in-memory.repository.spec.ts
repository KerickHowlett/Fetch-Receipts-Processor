import { Test, TestingModule } from '@nestjs/testing';

import { Receipt } from '../models/receipt.model';
import { ReceiptsRepository } from './receipts.in-memory.repository';

const MOCK_ID = 'MOCK_ID' as const;
jest.mock('uuid', () => ({
    v4: () => MOCK_ID,
}));

const MOCK_RECEIPT: Omit<Receipt, 'id'> = {
    retailer: 'Target',
    purchaseDate: '2022-01-01',
    purchaseTime: '12:00',
    items: [
        {
            shortDescription: 'Item 1',
            price: 10,
        },
    ],
    total: 10,
} as const;

describe('ReceiptsService', () => {
    let service: ReceiptsRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ReceiptsRepository],
        }).compile();

        service = module.get<ReceiptsRepository>(ReceiptsRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a receipt', () => {
            const response = service.create(MOCK_RECEIPT);

            expect(response).toEqual(MOCK_ID);
        });
    });

    describe('findOne', () => {
        beforeEach(() => {
            service.create(MOCK_RECEIPT);
        });

        it('should find a receipt', () => {
            const response = service.findOne(MOCK_ID);
            expect(response).toStrictEqual({ id: MOCK_ID, ...MOCK_RECEIPT } as const);
        });
    });
});
