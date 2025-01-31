import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import type { Receipt } from '../models/receipt.model';

@Injectable()
export class ReceiptsRepository {
    private readonly receipts: Map<Receipt['id'], Receipt> = new Map();

    create(receipt: Omit<Receipt, 'id'>): Receipt['id'] {
        const id = uuid() as Receipt['id'];
        this.receipts.set(id, { ...receipt, id } as const);

        return id;
    }

    findOne(id: Receipt['id']): Receipt | undefined {
        return this.receipts.get(id);
    }
}
