#!/bin/bash

PID_FILE="/tmp/ghichep-dev.pid"

if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if kill "$PID" > /dev/null 2>&1; then
    echo "Đã dừng dev server (PID $PID)"
  fi
  rm -f "$PID_FILE"
fi

# Dừng mọi process còn sót trên port 5173
REMAINING=$(lsof -ti:5173 2>/dev/null)
if [ -n "$REMAINING" ]; then
  echo "$REMAINING" | xargs kill -9
  echo "Đã dừng process còn lại trên port 5173"
fi

if ! lsof -ti:5173 > /dev/null 2>&1; then
  echo "Port 5173 đã giải phóng."
else
  echo "Không thể dừng hoàn toàn, thử lại với sudo."
fi
