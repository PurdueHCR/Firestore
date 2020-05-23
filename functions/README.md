# PurdueHCR-CloudFunctions

## How to run and test Cloud Functions on your computer

1. Make sure that you export your Google Cloud Credentials ```export GOOGLE_APPLICATION_CREDENTIALS='PATH TO DEV_key.json'```
2. cd into your functions folder
3. run ```npm run build```
4. Fix any errors then run ```firebase emulators:start --only functions```
5. Now open the PurdueHCR Webapp and naivgate to the [token page](https://purdue-hcr-test.firebaseapp.com/#/token). Log in, and copy the token. If you are not taken to a page with a token, make sure you are logged in and the url ends in /token.
6. Open ARC and type into the Request URl: <http://localhost:5001/purdue-hcr-test/us-central1/user/get>

7. Add a header to the request with the name: Authorization. The value should be a token you get from the web app that looks like: "Bearer LONG_CODE"
8. Hit send, and if you scroll to the bottom, you should see the response from the server. 200 Success and a json object with your user's infromation.
9. Congratulations! You are now able to host an emulator with the development API! Go to our [API Documentation](https://purdue-hcr-test.firebaseapp.com/api/) to see a list of available endpoints

## How to setup PurdueHCR Cloud Functions on your computer

0. Make sure you have a bash termial installed.
	1. [Git Bash](https://git-scm.com/download/win) (Windows)
	2. Terminal (MacOs)
1. Open the bash terminal and make sure npm is installed.
	- run ```npm -v```. If the command is not found, install Node
		- Windows go to [Node.js](http://nodejs.org) to install
		- Mac run ```brew install node```
			- If brew is not installed, go to [Homebrew](https://brew.sh/) and install it.
2. Talk to an exec member to download the Google Firebase Key, DEV_key.json, and save the path to this file as the environmental variable $GOOGLE_APPLICATION_CREDENTIALS.
	- ```export GOOGLE_APPLICATION_CREDENTIALS='PATH TO DEV_key.json'```
	- Note you have to give it an absolute path. using shortcuts like '..' may not work
3. Cd into the directory where you want the Cloud Functions to be saved and run the foloowing commands:
``` bash

git clone https://github.com/PurdueHCR/PurdueHCR-CloudFunctions.git
git checkout dev
cd functions/
npm install -g firebase-tools
npm install firebase-functions@latest firebase-admin@latest --save
firebase login
npm install
npm run build
firebase emulators:start --only functions
```

4. Open Google and search for [Advanced REST Client (ARC)](https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo?hl=en-US) and install it.
5. Now open the PurdueHCR Webapp and naivgate to the [token page](https://purdue-hcr-test.firebaseapp.com/#/token). Log in, and copy the token.
	- If you are not taken to a page with a token, make sure you are logged in and the url ends in /token.
6. Open ARC and type into the following fields:
	- Request URL: http://localhost:5001/purdue-hcr-test/us-central1/user/get
		- or optionally 
			- Host: http://localhost:5001
			- Path: /purdue-hcr-test/us-central1/user/get
	- Parameters
		- Headers
			- Header Name: Authorization
			- Header Value: (Paste the token)
7. Hit send, and if you scroll to the bottom, you should see the response from the server. 200 Success and a json object with your user's infromation.
8. Congratulations! You are now able to host an emulator with the development API!
	- Go to our [API Documentation](https://purdue-hcr-test.firebaseapp.com/swagger-ui/) to see a list of available endpoints
