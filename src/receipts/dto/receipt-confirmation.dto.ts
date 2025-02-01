import { ApiProperty } from '@nestjs/swagger';

export class ReceiptConfirmationDto {
    @ApiProperty({
        required: true,
        type: 'string',
        pattern: '^\\S+$',
        example: 'adb6b560-0eef-42bc-9d16-df48f30e89b2',
    })
    id: string;
}
