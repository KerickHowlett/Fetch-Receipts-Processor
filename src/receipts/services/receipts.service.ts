import { Injectable } from '@nestjs/common';

import type { CreateReceiptDto } from '../dto/create-receipt.dto';
import type { Receipt } from '../models/receipt.model';
import type { ReceiptsRepository } from '../repositories/receipts.in-memory.repository.repository';

@Injectable()
export class ReceiptsService {
    constructor(private readonly receiptsRepository: ReceiptsRepository) {}

    createReceipt(createReceiptDto: CreateReceiptDto): Pick<Receipt, 'id'> {
        const confirmation = this.receiptsRepository.create(createReceiptDto);

        return confirmation;
    }

    findOneReceipt(id: Receipt['id']): Receipt | undefined {
        const queriedReceipt = this.receiptsRepository.findOne(id);

        return queriedReceipt;
    }
}
