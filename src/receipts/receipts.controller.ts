import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateReceiptDto } from './dto/create-receipt.dto';

import {
    ApiBadRequestResponse,
    ApiConsumes,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
} from '@nestjs/swagger';
import type { ParameterObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ReceiptsService } from './receipts.service';

@Controller('receipts')
export class ReceiptsController {
    constructor(private readonly receiptsService: ReceiptsService) {}

    @ApiOperation({
        summary: 'Submits a receipt for processing.',
        description: 'Submits a receipt for processing.',
    })
    @ApiConsumes('application/json')
    @ApiOkResponse({
        description: 'Returns the ID assigned to the receipt.',
        schema: {
            type: 'object',
            required: ['id'],
            properties: {
                id: {
                    type: 'string',
                    pattern: '^\\S+$',
                    example: 'adb6b560-0eef-42bc-9d16-df48f30e89b2',
                },
            },
        },
    })
    @ApiBadRequestResponse({ description: 'The receipt is invalid.' })
    @Post('process')
    processReceipt(@Body() createReceiptDto: CreateReceiptDto) {
        return this.receiptsService.create(createReceiptDto);
    }

    @ApiOperation({
        summary: 'Returns the points awarded for the receipt.',
        description: 'Returns the points awarded for the receipt.',
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                description: 'The ID of the receipt.',
                schema: {
                    type: 'string',
                    pattern: '^\\S+$',
                },
            },
        ] as ParameterObject[],
    })
    @ApiOkResponse({
        description: 'The number of points awarded.',
        schema: {
            type: 'object',
            properties: {
                points: {
                    type: 'integer',
                    format: 'int64',
                    example: 100,
                },
            },
        },
    })
    @ApiNotFoundResponse({ description: 'No receipt found for that ID.' })
    @Get(':id/points')
    getPointsAwarded(@Param('id') id: string) {
        return this.receiptsService.findOne(+id);
    }
}
