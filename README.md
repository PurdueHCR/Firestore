# PurdueHCR Firestore

PurdueHCR Firestore is the repository for the PurdueHCR web app and the PurdueHCR API.

## Installation


## Running

## Deployment Instructions
To deploy the project, make sure you have the minimum requirements

### Key Files
- Web
    - prod.json
    - test.json
- Functions
    - production_config.sh
    - test_config.sh

### Setup Minimum Dependencies
1. Run `npm --version` to confirm version is at least 6.10.0
2. Install the latest version of firebase-tools using npm. `npm install -g firebase-tools`
3. Run `firebase login` and log into your firebase account.
4. Run `firebase projects:list`and ensure that you have access to the firebase project you are deploying to. 
    - If you don't see the project in that list, talk to an exec member to get access to the project.

### Deploy
1. If you are deploying the web version, Navigate to 'web_purduehcr/lib/Configuration/env'
    1. Ensure that you have the following file for your target enviornment
        - dev.json
        - test.json
        - prod.json
    2. Delete all files that end in .g.dart
    3. Run `flutter packages pub run build_runner build --delete-conflicting-outputs` to rebuild the .g.dart files with the correct information
2. If you are deploying functions, in the root project directory run either `./production_config.sh` or `./test_config.sh` depending on your target environment
3. In the root project directory run `./purduehcr build prod` or `./purduehcr build test`
4. Modify the file firebase.json
    - If deploying to test, make sure `site: purduehcr` is removed from line 11
    - If deploying to prod, make sure `site: purduehcr` is added on line 11
5. Run `firebase deploy` 
    - Option `--only functions` 
    - Option `--only hosting`


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
