#!/bin/bash

cd "$(dirname "$0")/.."

if lsof -ti:5173 > /dev/null 2>&1; then
  echo "Dev server đã đang chạy tại http://localhost:5173"
  exit 0
fi

echo "Đang khởi động dev server..."
nohup npm run dev > /tmp/ghichep-dev.log 2>&1 &
echo $! > /tmp/ghichep-dev.pid

sleep 2
echo "Dev server đang chạy tại http://localhost:5173"
echo "Log: /tmp/ghichep-dev.log"
