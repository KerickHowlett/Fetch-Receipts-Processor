import { HttpException, HttpStatus } from '@nestjs/common';

// DEFAULT POINT SCORES
export const NO_POINTS = 0;

// ERROR MESSAGES
export const INVALID_RECEIPT = 'The receipt is invalid.' as const;
export const RECEIPT_EXISTS = 'A receipt with that ID already exists.' as const;
export const RECEIPT_NOT_FOUND = 'No receipt found for that ID.' as const;

// HTTP EXCEPTIONS
export const RECEIPT_NOT_FOUND_EXCEPTION = new HttpException(
    RECEIPT_NOT_FOUND,
    HttpStatus.NOT_FOUND,
);
