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
import { GetPointsAwardedDto } from '../dto/get-points-awarded.dto';
import { ProcessReceiptDto } from '../dto/process-receipt.dto';
import { ReceiptConfirmationDto } from '../dto/receipt-confirmation.dto';
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
        type: ReceiptConfirmationDto,
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
        type: GetPointsAwardedDto,
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
