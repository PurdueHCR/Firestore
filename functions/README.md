# PurdueHCR-CloudFunctions

## How to setup PurdueHCR Cloud Functions on your computer


0. Requirements
	- Bash Terminal 
		- Windows
			- Activate the Linux Bash Shell [Tutorial](https://www.laptopmag.com/articles/use-bash-shell-windows-10)
		2. Terminal (MacOs)
	- Git: In your bash terminal, run `git help`. If it says 'Command not found', you will have to install Git. [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
	- Node/NPM: In your bash terminal, you should be able to type `npm -v` and have it print out a version of at least 6.10.0
		- Windows
			- Go to [Node.js](http://nodejs.org) to install
		- Mac 
			- run `brew install node`
				- If brew is not installed, go to [Homebrew](https://brew.sh/) and install it.
1. If you haven't already cloned this repository, in your bash terminal, use the `cd` command to navigate to a directory that you won't delete. Then run the command `git clone https://github.com/PurdueHCR/Firestore.git` to clone the repository.
2. Run the following commands:
``` bash
git checkout dev
cd functions/
npm install -g firebase-tools ts-node typescript
npm install
```
3. Talk to an exec member to download the following 2 key files and save them in the functions/development_keys folder.
	- dev.json
	- keys.json
4. In your bash terminal, run `npm run emulate`. You should get a message that "All emulators ready!" and the terminal should hang, while it waits for an api endpoint to be called.
5. Open Google and search for [Advanced REST Client (ARC)](https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo?hl=en-US) and install it.
6. Now open the PurdueHCR Webapp and naivgate to the [token page](https://purdue-hcr-test.firebaseapp.com/#/token). Log in, and copy the token.
	- If you are not taken to a page with a token, make sure you are logged in and the url ends in /token.
7. Open ARC and type into the following fields:
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
	