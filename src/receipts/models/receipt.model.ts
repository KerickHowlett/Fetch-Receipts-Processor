import type { Item } from './item.model';

export type Receipt = {
    id: string;
    retailer: string;
    purchaseDate: Date;
    purchaseTime: string;
    items: Item[];
    total: number;
};
