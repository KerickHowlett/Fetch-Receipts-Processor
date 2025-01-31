import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import type { Receipt } from '../models/receipt.model';

@Injectable()
export class ReceiptsRepository {
    constructor(private readonly receipts: Map<Receipt['id'], Receipt>) {}

    create(receipt: Omit<Receipt, 'id'>): Pick<Receipt, 'id'> | undefined {
        const id = uuid() as Receipt['id'];

        if (this.receipts.has(id)) return;
        this.receipts.set(id, { ...receipt, id });

        return { id };
    }

    findOne(id: Receipt['id']): Receipt | undefined {
        return this.receipts.get(id);
    }
}
