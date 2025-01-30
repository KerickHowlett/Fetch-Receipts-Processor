import { ApiProperty } from '@nestjs/swagger';

import { CreateItemDto } from './create-item.dto';

export class CreateReceiptDto {
    @ApiProperty({
        description: 'The name of the retailer or store the receipt is from.',
        example: 'M&M Corner Market',
        pattern: '^[\\w\\s\\-&]+$',
        required: true,
        type: 'string',
    })
    retailer: string;

    @ApiProperty({
        description: 'The date of the purchase printed on the receipt.',
        example: '2022-01-01',
        format: 'date',
        required: true,
        type: 'string',
    })
    purchaseDate: Date;

    @ApiProperty({
        description: 'The time of the purchase printed on the receipt. 24-hour time expected.',
        example: '13:01',
        format: 'time',
        required: true,
        type: 'string',
    })
    purchaseTime: string;

    @ApiProperty({
        minimum: 1,
        required: true,
        type: 'array',
    })
    items: CreateItemDto[];

    @ApiProperty({
        description: 'The total amount paid on the receipt.',
        example: '6.49',
        pattern: '^\\d+\\.\\d{2}$',
        required: true,
        type: 'string',
    })
    total: number;
}
