#!/bin/sh

echo "Running lint checks..."
npm run lint || exit 1

echo "Running unit tests..."
npm run test || exit 1

echo "Starting app in the background for e2e testing..."
nohup npm run start >/dev/null &

echo "Running e2e tests..."
sleep 5
npm run e2e || exit 1
