import { Test, TestingModule } from '@nestjs/testing';

import { NO_POINTS } from '../constants/receipts.const';
import type { ProcessItemDto } from '../dto/process-item.dto';
import { PointRulesService } from './point-rules.service';

describe('PointRulesService', () => {
    let service: PointRulesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PointRulesService],
        }).compile();

        service = module.get<PointRulesService>(PointRulesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('applyRetailerNameAlphaNumCharsRule', () => {
        it.each([
            {
                retailerName: 'Alphabet Store',
                expectedScore: 13,
            },
            {
                retailerName: 'Alphabet Store, Inc.',
                expectedScore: 16,
            },
            {
                retailerName: '21 Forever',
                expectedScore: 9,
            },
            {
                retailerName: '21 Forever, Inc.',
                expectedScore: 12,
            },
            {
                retailerName: '  Doctor   Who   Shop  ',
                expectedScore: 13,
            },
        ])('should return the score of the retailer name', ({ retailerName, expectedScore }) => {
            const points = service.applyRetailerNameAlphaNumCharsRule(retailerName);
            expect(points).toEqual(expectedScore);
        });
    });

    describe('applyRoundDollarAmountRule', () => {
        const AWARDED_POINTS = 50;

        it.each([
            {
                total: 10,
                expectedScore: AWARDED_POINTS,
            },
            {
                total: 10.99,
                expectedScore: NO_POINTS,
            },
            {
                total: 11.0,
                expectedScore: AWARDED_POINTS,
            },
        ])(
            'should return the score based on whether it has a whole dollar amount or not',
            ({ total, expectedScore }) => {
                const points = service.applyRoundDollarAmountRule(total);
                expect(points).toEqual(expectedScore);
            },
        );
    });

    describe('applyCleanQuarterDividendRule', () => {
        const AWARDED_POINTS = 25;

        it.each([
            {
                total: 10,
                expected: AWARDED_POINTS,
            },
            {
                total: 10.99,
                expected: NO_POINTS,
            },
        ])(
            'should calculate points for a clean quarter dividend of receipt total',
            ({ total, expected }) => {
                const points = service.applyCleanQuarterDividendRule(total);
                expect(points).toEqual(expected);
            },
        );
    });

    describe('applyItemPairsRule', () => {
        const ITEM_ONE: ProcessItemDto = {
            shortDescription: 'Item 1',
            price: 10,
        } as const;

        const ITEM_TWO: ProcessItemDto = {
            shortDescription: 'Item 2',
            price: 20,
        } as const;

        const ITEM_THREE: ProcessItemDto = {
            shortDescription: 'Item 3',
            price: 30,
        } as const;

        const ITEM_FOUR: ProcessItemDto = {
            shortDescription: 'Item 4',
            price: 40,
        } as const;

        it.each([
            {
                items: [],
                expected: NO_POINTS,
            },
            {
                items: [ITEM_ONE],
                expected: NO_POINTS,
            },
            {
                items: [ITEM_ONE, ITEM_TWO],
                expected: 5,
            },
            {
                items: [ITEM_ONE, ITEM_TWO, ITEM_THREE],
                expected: 5,
            },
            {
                items: [ITEM_ONE, ITEM_TWO, ITEM_THREE, ITEM_FOUR],
                expected: 10,
            },
        ])('should calculate points based on total item pairs', ({ items, expected }) => {
            const points = service.applyItemPairsRule(items);
            expect(points).toEqual(expected);
        });
    });

    describe('applyItemDescriptionsLengthRule', () => {
        const ITEM_WITH_NEEDED_DESCRIPTION_LENGTH: ProcessItemDto = {
            shortDescription: '123123123',
            price: 10,
        } as const;

        const ITEM_WITHOUT_NEEDED_DESCRIPTION_LENGTH: ProcessItemDto = {
            shortDescription: '12345',
            price: 10,
        } as const;

        it.each([
            {
                items: [],
                expected: NO_POINTS,
            },
            {
                items: [ITEM_WITH_NEEDED_DESCRIPTION_LENGTH],
                expected: 2,
            },
            {
                items: [ITEM_WITH_NEEDED_DESCRIPTION_LENGTH, ITEM_WITH_NEEDED_DESCRIPTION_LENGTH],
                expected: 4,
            },
            {
                items: [ITEM_WITHOUT_NEEDED_DESCRIPTION_LENGTH],
                expected: NO_POINTS,
            },
            {
                items: [
                    ITEM_WITHOUT_NEEDED_DESCRIPTION_LENGTH,
                    ITEM_WITHOUT_NEEDED_DESCRIPTION_LENGTH,
                ],
                expected: NO_POINTS,
            },
            {
                items: [
                    ITEM_WITH_NEEDED_DESCRIPTION_LENGTH,
                    ITEM_WITHOUT_NEEDED_DESCRIPTION_LENGTH,
                ],
                expected: 2,
            },
        ])(
            'should calculate points based on total item descriptions length',
            ({ items, expected }) => {
                const points = service.applyItemDescriptionsLengthRule(items);
                expect(points).toEqual(expected);
            },
        );
    });

    describe('applyPurchaseDateDayRule', () => {
        const AWARDED_POINTS = 6;

        type TestCase = { purchaseDate: `${number}-${number}-${number}`; expected: number };

        it.each([
            {
                purchaseDate: '2025-01-01',
                expected: AWARDED_POINTS,
            },
            {
                purchaseDate: '2025-01-02',
                expected: NO_POINTS,
            },
        ] as TestCase[])('', ({ purchaseDate, expected }) => {
            const points = service.applyPurchaseDateDayRule(purchaseDate);
            expect(points).toEqual(expected);
        });
    });

    describe('applyPurchaseTimeRangeRule', () => {
        const AWARDED_POINTS = 10;

        type TestCase = { purchaseTime: `${number}:${number}`; expected: number };

        it.each([
            {
                purchaseTime: '13:00',
                expected: NO_POINTS,
            },
            {
                purchaseTime: '14:00',
                expected: NO_POINTS,
            },
            {
                purchaseTime: '14:30',
                expected: AWARDED_POINTS,
            },
            {
                purchaseTime: '15:00',
                expected: AWARDED_POINTS,
            },
            {
                purchaseTime: '16:00',
                expected: NO_POINTS,
            },
            {
                purchaseTime: '17:00',
                expected: NO_POINTS,
            },
        ] as TestCase[])(
            'should calculate points based on whether the purchase time is within 2pm and 4pm',
            ({ purchaseTime, expected }) => {
                const points = service.applyPurchaseTimeRangeRule(purchaseTime);
                expect(points).toEqual(expected);
            },
        );
    });
});
