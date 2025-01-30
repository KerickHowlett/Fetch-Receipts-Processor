import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateReceiptDto } from './dto/create-receipt.dto';

import { ReceiptsService } from './receipts.service';

@Controller('receipts')
export class ReceiptsController {
    constructor(private readonly receiptsService: ReceiptsService) {}

    @Post('process')
    create(@Body() createReceiptDto: CreateReceiptDto) {
        return this.receiptsService.create(createReceiptDto);
    }

    @Get()
    findAll() {
        return this.receiptsService.findAll();
    }

    @Get(':id/points')
    findOne(@Param('id') id: string) {
        return this.receiptsService.findOne(+id);
    }
}
