#!/usr/bin/env sh

echo "Running unit tests..."
npm run test

echo "Starting app in the background for e2e testing..."
nohup npm run start >/dev/null &

echo "Running e2e tests..."
sleep 5
npm run e2e
