#!/usr/bin/env bash
set -euo pipefail

set -a
source backend/.env
set +a

cd backend && mvn spring-boot:run
