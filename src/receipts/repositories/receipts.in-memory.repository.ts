import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ReceiptsRepository {
    private readonly receipts: Map<string, number> = new Map();

    create(score: number): string {
        const id = uuid();
        this.receipts.set(id, score);

        return id;
    }

    findOne(id: string): number | undefined {
        return this.receipts.get(id);
    }
}
