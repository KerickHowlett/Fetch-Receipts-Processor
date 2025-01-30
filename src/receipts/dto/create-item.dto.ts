import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
    @ApiProperty({
        description: 'The Short Product Description for the item.',
        example: 'Mountain Dew 12PK',
        pattern: '^[\\w\\s\\-]+$',
        required: true,
        type: 'string',
    })
    shortDescription: string;

    @ApiProperty({
        description: 'The Short Product Description for the item.',
        example: '6.49',
        pattern: '^\\d+\\.\\d{2}$',
        required: true,
        type: 'string',
    })
    price: number;
}
