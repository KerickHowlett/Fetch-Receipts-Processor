import axios from 'axios';

import { HttpStatus } from '@nestjs/common';

const MOCK_RECEIPTS = [
    {
        retailer: 'Target',
        purchaseDate: '2022-01-01',
        purchaseTime: '13:01',
        items: [
            {
                shortDescription: 'Mountain Dew 12PK',
                price: '6.49',
            },
            {
                shortDescription: 'Emils Cheese Pizza',
                price: '12.25',
            },
            {
                shortDescription: 'Knorr Creamy Chicken',
                price: '1.26',
            },
            {
                shortDescription: 'Doritos Nacho Cheese',
                price: '3.35',
            },
            {
                shortDescription: '   Klarbrunn 12-PK 12 FL OZ  ',
                price: '12.00',
            },
        ],
        total: '35.35',
    },
    {
        retailer: 'M&M Corner Market',
        purchaseDate: '2022-03-20',
        purchaseTime: '14:33',
        items: [
            {
                shortDescription: 'Gatorade',
                price: '2.25',
            },
            {
                shortDescription: 'Gatorade',
                price: '2.25',
            },
            {
                shortDescription: 'Gatorade',
                price: '2.25',
            },
            {
                shortDescription: 'Gatorade',
                price: '2.25',
            },
        ],
        total: '9.00',
    },
    {
        retailer: 'Walgreens',
        purchaseDate: '2022-01-02',
        purchaseTime: '08:13',
        total: '2.65',
        items: [
            { shortDescription: 'Pepsi - 12-oz', price: '1.25' },
            { shortDescription: 'Dasani', price: '1.40' },
        ],
    },
    {
        retailer: 'Target',
        purchaseDate: '2022-01-02',
        purchaseTime: '13:13',
        total: '1.25',
        items: [{ shortDescription: 'Pepsi - 12-oz', price: '1.25' }],
    },
] as const;

const DOMAIN = 'http://localhost:4000/api/v1' as const;
const POST_ENDPOINT = `${DOMAIN}/receipts/process` as const;
const EXPECTED_ERROR = 'total must be a number conforming to the specified constraints' as const;

describe('Receipts', () => {
    describe(`POST /api/v1/receipts/process`, () => {
        it.each(MOCK_RECEIPTS)(
            'should return with the id after saving receipt',
            async (receiptBody) => {
                expect.assertions(2);
                try {
                    const response = await axios.post<{ id: string }>(POST_ENDPOINT, receiptBody);

                    expect(response.status).toBe(HttpStatus.OK);
                    expect(response.data).toStrictEqual({ id: expect.any(String) });
                } catch (error) {
                    console.log(error);
                }
            },
        );

        it('should return 400 if receipt is invalid', async () => {
            expect.assertions(2);

            try {
                await axios.post(POST_ENDPOINT, { ...MOCK_RECEIPTS[0], total: 'invalid' });
            } catch (error) {
                expect(error.response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(error.response.data.message[0]).toBe(EXPECTED_ERROR);
            }
        });
    });

    describe(`GET /api/receipts/:id/points`, () => {
        it.each([
            {
                receipt: MOCK_RECEIPTS[0],
                expected: 31,
            },
            {
                receipt: MOCK_RECEIPTS[1],
                expected: 109,
            },
            {
                receipt: MOCK_RECEIPTS[2],
                expected: 15,
            },
            {
                receipt: MOCK_RECEIPTS[3],
                expected: 31,
            },
        ])('should return the calculated points', async ({ receipt, expected }) => {
            const {
                data: { id },
            } = await axios.post<{ id: string }>(POST_ENDPOINT, receipt);

            const response = await axios.get(`${DOMAIN}/receipts/${id}/points`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.data).toStrictEqual({ points: expected });
        });

        it('should return 404 if receipt does not exist', async () => {
            expect.assertions(2);
            try {
                await axios.get(`${DOMAIN}/receipts/invalid-id/points`);
            } catch (error) {
                expect(error.response.status).toBe(HttpStatus.NOT_FOUND);
                expect(error.response.data.message).toBe('No receipt found for that ID.');
            }
        });
    });
});
