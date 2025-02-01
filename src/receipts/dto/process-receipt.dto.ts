import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
    Matches,
    ValidateNested,
} from 'class-validator';

import { ProcessItemDto } from './process-item.dto';

export class ProcessReceiptDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\w\s\-&]+$/i)
    @ApiProperty({
        description: 'The name of the retailer or store the receipt is from.',
        example: 'M&M Corner Market',
        pattern: '^[ws-&]+$',
        required: true,
        type: 'string',
    })
    retailer: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/)
    @ApiProperty({
        description: 'The date of the purchase printed on the receipt.',
        example: '2022-01-01',
        format: 'date',
        pattern: '^d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$',
        required: true,
        type: 'string',
    })
    purchaseDate: `${number}-${number}-${number}`;

    @IsString()
    @IsNotEmpty()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    @ApiProperty({
        description: 'The time of the purchase printed on the receipt. 24-hour time expected.',
        example: '13:01',
        pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
        format: 'time',
        required: true,
        type: 'string',
    })
    purchaseTime: `${number}:${number}`;

    @IsArray()
    @ValidateNested()
    @ArrayMinSize(1)
    @ApiProperty({
        minimum: 1,
        required: true,
        type: [ProcessItemDto],
    })
    items: ProcessItemDto[];

    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        description: 'The total amount paid on the receipt.',
        example: 'M&M Corner Market',
        pattern: '^\\d+\\.\\d{2}$',
        required: true,
        type: 'string',
    })
    total: number;
}
