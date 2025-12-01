#!/bin/bash
cd /home/kavia/workspace/code-generation/mood-tracker-visualizer-284995-285012/frontend_react
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

