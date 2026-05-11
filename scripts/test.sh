#!/bin/bash
set -e;

./scripts/build.sh;

npx ts-node ./tests/pong.ts;