#!/bin/bash

# Create Redis data directory
mkdir -p /tmp/redis-data

# Check if Redis is already running
if ! redis-cli ping > /dev/null 2>&1; then
  echo "Starting Redis server..."
  redis-server --daemonize yes --dir /tmp/redis-data --port 6379 --logfile /tmp/redis.log
  
  # Wait for Redis to be ready
  max_attempts=10
  attempt=0
  while [ $attempt -lt $max_attempts ]; do
    if redis-cli ping > /dev/null 2>&1; then
      echo "Redis is ready!"
      break
    fi
    attempt=$((attempt+1))
    sleep 1
  done
  
  if [ $attempt -eq $max_attempts ]; then
    echo "Failed to start Redis after $max_attempts attempts"
    exit 1
  fi
else
  echo "Redis is already running"
fi

# Start the Node application
NODE_ENV=development tsx server/index.ts
