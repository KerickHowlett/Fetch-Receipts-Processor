import { Injectable } from '@nestjs/common';

import { CreateReceiptDto } from './dto/create-receipt.dto';
import type { Receipt } from './models/receipt.model';
import { ReceiptsRepository } from './receipts.repository';

@Injectable()
export class ReceiptsService {
    constructor(private readonly receiptsRepository: ReceiptsRepository) {}

    create(createReceiptDto: CreateReceiptDto): Pick<Receipt, 'id'> {
        const confirmation = this.receiptsRepository.create(createReceiptDto);

        return confirmation;
    }

    findOne(id: Receipt['id']): Receipt | undefined {
        const queriedReceipt = this.receiptsRepository.findOne(id);

        return queriedReceipt;
    }
}
