# PurdueHCR Firestore

PurdueHCR Firestore is the repository for the PurdueHCR web app and the PurdueHCR API.

## Installation

To install, open a bash terminal, navigate to the directory where you want to download this repository, and run 
```
git clone https://github.com/PurdueHCR/Firestore.git
cd Firestore
./purduehcr install    
```

## Usage
Before you build and run the web app or functions, contact the PurdueHCR team to get the required configuration files. You will need:
- dev.json
- test.json
- Purdue_HCR_TEST.json

To build the web page and the functions for a specific environment run `./purduehcr build <env>` where env is replaced with dev, test, or prod.

To run the app locally, make sure you build first, then run ```firebase emulators:start``` This will create emulators on your computer for hosting, functions, and firestore. 

By default, your functions emulator will look at your local firestore instance for its data, so to tell your emulator to look at the TEST environment, you need to export the environment variable GOOGLE\_APPLICATION\_CREDENTIALS with the path to the Purdue\_HCR\_TEST.json file.
```
export GOOGLE_APPLICATION_CREDENTIALS=<PATH_TO_FILE>/Purdue_HCR_TEST.json
```

For more information on how to run the web page or the cloud functions, refer to the [Web](/purduehcr_web/README.md) or [Functions](/functions/README.md) README files.

## Testing 
To run UI, Integration, and Unit tests, run the command 
```
./purduehcr test
```


## Contributing
Pull requests are always welcome, however please coordinate with the PurdueHCR Development Team.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
