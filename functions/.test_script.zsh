#!/bin/zsh


alias jest='./node_modules/.bin/jest'

usage() { echo "Usage:  [args]\n\n-t\tRun either integration tests, unit tests, or a specific file\n<unit, integration, path_to_file>\n\n-v\tRun test in verbose mode. \n\nTo run a test with a specific file, an example is -t \"test/functions/GetUser.test.ts\". To run one test, declare it in the file as it.only or test.only" 1>&2; exit 1;}

UNIT="/test\/functions\/.*\.test\.ts"
INTEGRATION="/test\/endpoints\/.*\/.*\.test\.ts"
TESTING="(?:$UNIT|$INTEGRATION)"
SILENT=1
LAUNCH_DATABASE=1
RETURN_CODE=0

while getopts ":hvt:" arg; do
  case $arg in
    h)
      usage
      ;;
    v)
      SILENT=0
      ;;
    t)
      VALUE=${OPTARG}
      if [ $VALUE = "unit" ]; then
        LAUNCH_DATABASE=0
	TESTING=$UNIT
      elif [ $VALUE = "integration" ]; then
	TESTING=$INTEGRATION
      else
	TESTING=$VALUE
      fi
      ;;
  esac
done

if [ $LAUNCH_DATABASE -eq 1 ]; then
  export FIRESTORE_EMULATOR_HOST=localhost:8080
  echo "Starting Firebase Emulator"
  firebase emulators:start --only firestore &> /dev/null &
  sleep 2
fi

echo "Starting Tests"
if [ $SILENT -eq 1 ]; then
  jest --config ./jest.config.js "$TESTING" --silent --runInBand
else
  echo "Verbose mode"
  jest --config ./jest.config.js "$TESTING" --runInBand
fi

RETURN_CODE=$?

if [ $LAUNCH_DATABASE -eq 1 ]; then
  echo "Shutting Down Emulator"
  pkill java
  sleep 2
fi

return RETURN_CODE
