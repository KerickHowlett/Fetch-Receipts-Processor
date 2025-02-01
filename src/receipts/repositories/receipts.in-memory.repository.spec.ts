import { Test, TestingModule } from '@nestjs/testing';

import { ReceiptsRepository } from './receipts.in-memory.repository';

const MOCK_ID = 'MOCK_ID' as const;
jest.mock('uuid', () => ({
    v4: () => MOCK_ID,
}));

const MOCK_SCORE = 5;

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
            const response = service.create(MOCK_SCORE);

            expect(response).toEqual(MOCK_ID);
        });
    });

    describe('findOne', () => {
        beforeEach(() => {
            service.create(MOCK_SCORE);
        });

        it("should find receipt's awarded points", () => {
            const response = service.findOne(MOCK_ID);
            expect(response).toEqual(MOCK_SCORE);
        });

        it('should not find a receipt', () => {
            const response = service.findOne('INVALID_ID');
            expect(response).toBeUndefined();
        });
    });
});
