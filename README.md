# Fetch's Receipt Processor

## Overview

This repository contains a demo backend server application for storing receipts
and awarding points to them based on a predefined criteria, which can be found
[here](https://github.com/fetch-rewards/receipt-processor-challenge?tab=readme-ov-file#rules).

## Features

The service application implements the following REST API:

| Method | URL                      | Description                              |
|--------|--------------------------|------------------------------------------|
| GET    | /health                  | Get service health                       |
| GET    | /api/receipts/:id/points | Get points awarded to receipt            |
| POST   | /api/receipts/process    | Add one receipt                          |

## Instructions

### Run Application

Enter the following commands from this project's root directory.

```sh
docker build -t fetch-api .
docker run -p 4000:4000 fetch-api:latest
```

#### API Endpoint

The local API Endpoint URL is `http://localhost:4000/api`.

#### OpenAPI Specs Documentation

If you wish to take a look at the OpenAPI Specs via the Swagger UI that's based
on the one provided from the original repo, open your browser of choice and then
enter the following URL: `http://localhost:4000/api/docs`.

#### Receipts Code Location

The heart of the work for the Receipts features can be found [here](./src/receipts/).

### Perform Automated Tests

This code contains both automated unit tests and E2E tests.

The test cases were pulled from the examples provided in the original README.md
file.

If you wish to run these tests, they can be ran from within the Docker container
by entering the following command:

```sh
docker build --target "test" -t fetch-api-tests -t fetch-tests .
docker run fetch-api-tests
```

#### E2E Test Location

The E2E Test Cases can be found [here](./e2e/src/server/receipts.spec.ts).

## Other Notes

### Time Range Rule Assumption

Based on the wording in the established rules regarding the time range, I treated
the time window's bordering hours (***after*** 2:00pm and ***before*** 4:00pm)
as ***exclusive***.

I created a single if-statement block that handles the boundary hours, so if my
assumption is inaccurate, you can just comment out or outright remove it, as
its in-line NOTE indicates.

### Post Creation HTTP Status Code

Normally, the HTTP Status code returned after a successful POST is `201`. However,
the `app.yml` OpenAPI specs file from the original repo declares its "OK" Status
as `200`, so I did the same here to keep everything consistent.
