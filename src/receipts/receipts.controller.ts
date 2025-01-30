import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
} from '@nestjs/swagger';
import type { ParameterObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import {
    INVALID_RECEIPT,
    RECEIPT_EXISTS,
    RECEIPT_NOT_FOUND,
} from './constants/error-messages.const';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import type { Receipt } from './models/receipt.model';
import { ReceiptsService } from './receipts.service';

@Controller('receipts')
export class ReceiptsController {
    constructor(private readonly receiptsService: ReceiptsService) {}

    @ApiOperation({
        summary: 'Submits a receipt for processing.',
        description: 'Submits a receipt for processing.',
    })
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
    @ApiBadRequestResponse({ description: INVALID_RECEIPT })
    @Post('process')
    processReceipt(@Body() createReceiptDto: CreateReceiptDto) {
        const createdReceiptId = this.receiptsService.createReceipt(createReceiptDto);

        if (!createdReceiptId) {
            throw new HttpException(RECEIPT_EXISTS, HttpStatus.BAD_REQUEST);
        }

        return this.receiptsService.createReceipt(createReceiptDto);
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
    @ApiNotFoundResponse({ description: RECEIPT_NOT_FOUND })
    @Get(':id/points')
    getPointsAwarded(@Param('id') id: Receipt['id']) {
        const receipt = this.receiptsService.findOneReceipt(id);

        if (!receipt) {
            throw new HttpException(RECEIPT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return receipt;
    }
}
