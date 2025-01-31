import type { PurchaseDate, PurchaseTime } from '../types';
import type { Item } from './item.model';

export type Receipt = {
    id: string;
    retailer: string;
    purchaseDate: PurchaseDate;
    purchaseTime: PurchaseTime;
    items: Item[];
    total: number;
};
