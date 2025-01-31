import { Injectable } from '@nestjs/common';

import { NO_POINTS } from '../constants/receipts.const';
import type { Item } from '../models/item.model';
import type { Receipt } from '../models/receipt.model';

@Injectable()
export class PointsService {
    /**
     * This function takes a retailer name and scores it by how many alphanumeric
     * characters it contains. This is used to calculate points for the retailer.
     *
     * @param retailerName the name of the retailer
     * @returns the score of the retailer name
     */
    applyRetailerNameAlphaNumCharsRule(retailerName: Receipt['retailer']): number {
        const alphaNumChars = retailerName.replace(/[^a-zA-Z0-9]/g, '');
        return alphaNumChars.length;
    }

    /**
     * This function takes a total amount and scores it by whether it is a whole
     * dollar amount or has a non-zero change. This is used to calculate points
     * for the total.
     *
     * @param total the total amount of the receipt
     * @returns the score of the total amount
     */
    applyRoundDollarAmountRule(total: Receipt['total']): number {
        const DECIMAL = '.' as const;
        const AWARDED_POINTS = 50;

        const stringifiedNumber = total.toString();
        if (!stringifiedNumber.includes(DECIMAL)) {
            return AWARDED_POINTS;
        }

        const change = +stringifiedNumber.split(DECIMAL)[1];
        if (change === 0) {
            return AWARDED_POINTS;
        }

        return NO_POINTS;
    }

    /**
     * This function takes a total amount and scores it by whether it is a clean
     * quarter dividend. This is used to calculate points for the total.
     *
     * @param total the total amount of the receipt
     * @returns the score of the total amount
     */
    applyCleanQuarterDividendRule(total: Receipt['total']): number {
        const QUARTER = 0.25;
        const AWARDED_POINTS = 25;

        const isCleanQuarterDividend = total % QUARTER === 0;
        if (isCleanQuarterDividend) {
            return AWARDED_POINTS;
        }

        return NO_POINTS;
    }

    /**
     * This function takes a list of items and scores it by how many pairs of
     * items it contains. This is used to calculate points for the items.
     *
     * @param items the list of items
     * @returns the score of the items
     */
    applyItemPairsRule(items: ReadonlyArray<Item>): number {
        const AWARDED_POINTS_BASE = 5;

        const totalItemPairs = Math.floor(items.length / 2);
        return totalItemPairs * AWARDED_POINTS_BASE;
    }

    /**
     * This function takes a list of items and scores it by how many alphanumeric
     * characters it contains. This is used to calculate points for the items.
     *
     * @param items the list of items
     * @returns the score of the items
     */
    applyItemDescriptionsLengthRule(items: Item[]): number {
        const AWARDED_POINTS_BASE = 0.2;

        return items.reduce((totalPoints, item) => {
            const itemDescriptionLength = item.shortDescription.trim().length;

            const isMultipleOfThree = itemDescriptionLength % 3 === 0;
            if (!isMultipleOfThree) {
                return totalPoints;
            }

            const awardedItemPoints = Math.round(itemDescriptionLength * AWARDED_POINTS_BASE);
            return totalPoints + awardedItemPoints;
        }, 0);
    }

    /**
     * This function takes a purchase date and scores it by whether it is an even
     * day. This is used to calculate points for the purchase date.
     *
     * @param purchaseDate the date of the purchase
     * @returns the score of the purchase date
     */
    applyPurchaseDateDayRule(purchaseDate: Receipt['purchaseDate']): number {
        const day = +purchaseDate.split('-')[2];

        const isDayEvenNumber = day % 2 === 0;
        if (isDayEvenNumber) {
            return NO_POINTS;
        }

        const AWARDED_POINTS = 6;
        return AWARDED_POINTS;
    }

    /**
     * This function takes a purchase time and scores it by whether it is within
     * 2pm and 4pm. This is used to calculate points for the purchase time.
     *
     * @param purchaseTime the time of the purchase
     * @returns the score of the purchase time
     */
    applyPurchaseTimeRangeRule(purchaseTime: Receipt['purchaseTime']): number {
        const TWO_PM = 14;
        const FOUR_PM = 16;

        const [hour, minute] = purchaseTime.split(':').map(Number);

        const isOutsideHourRange = hour < TWO_PM || hour > FOUR_PM;
        if (isOutsideHourRange) {
            return NO_POINTS;
        }

        // NOTE: Based on how the Rule's specific wording in the README file,
        //       I'm assuming both 2:00pm and 4:00pm are to be considered
        //       exclusive to the defined time range.
        //       If this assumption is incorrect, however, just comment out or
        //       outright remove the below if-statement.
        const isOnTheBorderingHour = (hour === TWO_PM || hour === FOUR_PM) && minute === 0;
        if (isOnTheBorderingHour) {
            return NO_POINTS;
        }

        const AWARDED_POINTS = 10;
        return AWARDED_POINTS;
    }
}
