import type { Item } from './item.model';

export type Receipt = {
    id: number;
    retailer: string;
    purchaseDate: Date;
    purchaseTime: string;
    items: Item[];
};

export type ReceiptWithPoints = Receipt & {
    points: number | undefined;
};
