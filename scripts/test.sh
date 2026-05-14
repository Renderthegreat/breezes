#!/bin/bash
set -e;

./scripts/build.sh;

node ./dist/tests/app/server/index.js;