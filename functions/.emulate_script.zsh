#!/bin/zsh

echo "\u001b[43;1mExporting functions/development_keys/dev.json to the google credentials. If the dev.json file is not in that folder, there may be problems when running the emulators.\u001b[0m"
export GOOGLE_APPLICATION_CREDENTIALS="`pwd`/development_keys/dev.json"
echo "GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS"
npm run build
firebase emulators:start --only functions
