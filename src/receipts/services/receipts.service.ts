import { Injectable } from '@nestjs/common';

import type { CreateReceiptDto } from '../dto/create-receipt.dto';
import type { Receipt } from '../models/receipt.model';
import { ReceiptsRepository } from '../repositories/receipts.in-memory.repository';

@Injectable()
export class ReceiptsService {
    constructor(private readonly receiptsRepository: ReceiptsRepository) {}

    createReceipt(createReceiptDto: CreateReceiptDto): Receipt['id'] | undefined {
        return this.receiptsRepository.create(createReceiptDto);
    }

    findOneReceipt(id: Receipt['id']): Receipt | undefined {
        return this.receiptsRepository.findOne(id);
    }
}
