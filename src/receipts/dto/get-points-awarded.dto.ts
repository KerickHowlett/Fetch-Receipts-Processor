import { ApiProperty } from '@nestjs/swagger';

export class GetPointsAwardedDto {
    @ApiProperty({
        required: true,
        type: 'integer',
        format: 'int64',
        example: 100,
    })
    points: number;
}
