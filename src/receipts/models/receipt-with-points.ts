import type { Receipt } from './receipt.model';

export type ReceiptWithPoints = Receipt & {
    points: number | undefined;
};
