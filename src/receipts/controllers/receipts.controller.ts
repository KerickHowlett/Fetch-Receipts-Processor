import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';

import {
    INVALID_RECEIPT,
    RECEIPT_NOT_FOUND,
    RECEIPT_NOT_FOUND_EXCEPTION,
} from '../constants/receipts.const';
import { ProcessReceiptDto } from '../dto/process-receipt.dto';
import { ReceiptsService } from '../services/receipts.service';

@Controller('receipts')
export class ReceiptsController {
    constructor(private readonly receiptsService: ReceiptsService) {}

    // NOTE: Successful POST requests should return 201, but the original spec
    //       specifies 200.
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Submits a receipt for processing.',
        description: 'Submits a receipt for processing.',
    })
    @ApiResponse({
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
    @ApiBody({ type: ProcessReceiptDto })
    @ApiBadRequestResponse({ description: INVALID_RECEIPT })
    @Post('process')
    processReceipt(@Body() createReceiptDto: ProcessReceiptDto) {
        const id = this.receiptsService.processReceipt(createReceiptDto);

        return { id };
    }

    @ApiOperation({
        summary: 'Returns the points awarded for the receipt.',
        description: 'Returns the points awarded for the receipt.',
    })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the receipt.' })
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
    getPointsAwarded(@Param('id') id: string) {
        const score = this.receiptsService.findScoreById(id);

        if (!score) {
            throw RECEIPT_NOT_FOUND_EXCEPTION;
        }

        return { points: score };
    }
}
