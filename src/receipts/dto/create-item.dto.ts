import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateItemDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\\w\\s\\-]+$/i)
    @ApiProperty({
        description: 'The Short Product Description for the item.',
        example: 'Mountain Dew 12PK',
        pattern: '^[\\w\\s\\-]+$',
        required: true,
        type: 'string',
    })
    shortDescription: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\\d+\\.\\d{2}$/)
    @Type(() => Number)
    @ApiProperty({
        description: 'The Short Product Description for the item.',
        example: '6.49',
        pattern: '^\\d+\\.\\d{2}$',
        required: true,
        type: 'string',
    })
    price: number;
}
