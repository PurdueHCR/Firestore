# PurdueHCR Flutter

This is the repository for the PurdueHCR Flutter Web app. This app is hosted using Google Firebase. Installation steps are listed below, as are some other miscellaneous resources. Tutorials can be found in the [tutorials](/tutorials) folder.

## Installation and setup
These setup instructions will guide you through the installation of Flutter and setting up your project in Android Studio. Some creative and futuristic person will have to create VS Code installation instructions.

**You will need access to a bash terminal with Git enabled to install everything. If you are on Mac or Linux, you can ignore this. If you are on windows, you will need to install [Git Bash](https://git-scm.com/downloads)**

If you are unfamiliar with bash, here is a helpful [Bash Cheat Sheet](https://www.educative.io/blog/bash-shell-command-cheat-sheet). In these instructions when the term **navigate** is used, you will need to use the command `cd [DIRECTORY]`.

### Installing Flutter
Flutter is Google's cross platform development tool. This means that you can develop one code base and deploy it as a native app with almost no changes on iOS, Android, and Web. Downloading is easy, so lets get started! 

First, open up a bash/zsh terminal. On Mac and Linux, open the terminal. On windows, you will have to either download a bash terminal or activate the developer bash console (Google how to do this). In the terminal, navigate to a directory which you will not delete, ideally this should be a high level folder such as your home directory, and run `git clone https://github.com/flutter/flutter.git`. This will download the source code for the Flutter SDK.

**Cool. How do I use the SDK?**
To use flutter in the terminal, we need to add the Flutter SDK to your PATH. If you look at [Flutter's Installation Page](https://flutter.dev/docs/get-started/install), Google will tell you to run ``export PATH="$PATH:`pwd`/flutter/bin"``. This saves the location of the flutter executable to the PATH variable in your terminal. The problem? This path only exists while you have the terminal open. As soon as you close it, your terminal will forget where flutter is. To ensure the terminal remembers where flutter is, you will need to edit your .\<rc file\>. 
- If you use bash
    - ``touch ~/.bashrc; echo "export PATH=\"\$PATH:`pwd`/flutter/bin\"" >> ~/.bashrc``
- If you use zsh
    - ``touch ~/.zshrc; echo "export PATH=\"\$PATH:`pwd`/flutter/bin\"" >> ~/.zshrc``

There you go! Flutter is all setup! Try closing your terminal window, reopen it and run `which flutter`. If it prints a path to the correct location, it is setup correctly. If it does not print anything, run the command `echo $PATH` and look for the section on flutter. A common mistake is for the path to be /flutter/flutter/bin. If that is the path, you will need to modify the .\<rc file\> and fix the path. 

Now run `flutter doctor`. This will give you a list of steps to complete. Don't worry about doing them now. We will complete the important steps in this tutorial. You can come back and complete the remaining steps later.

Head over to [Flutter's Installation Page](https://flutter.dev/docs/get-started/install) if you have any problems with the installation.

### Setup Flutter Web
Flutter is a new tool, and as such, some parts are still in beta. Specifically, the single aspect that is most critical to the success of our project: Flutter Web. Lets get it setup!

Go to your terminal and run the following commands.
```bash
flutter channel beta
flutter upgrade
flutter config --enable-web
flutter devices
```
If you see Chrome listed as an option in the list of flutter devices, Tada! Flutter Web is set up.

### Setting up Android Studio
Let's get you ready with Android Studio! VS Code is another good option, but no one knows how to setup Flutter with that. If only someone who was really cool would update this Readme with instructions on how to setup the PurdueHCR Flutter Web app in VS Code. ¯\\_(ツ)_/¯

First, [download Android Studio](https://developer.android.com/studio). This will take a few decades, so budget your time accordingly. Once AS is done installing, open it and go to 
- Windows: File, then go to settings
- Mac: Android Studio, Preferences

Now, select **Plugins**. Search for and install the *Flutter* and *Dart* plug-ins. Once installed, go back to the settings and select the section labeled **Languages & Frameworks**. Click on the **Flutter** and set the Flutter SDK path to be the folder where you installed Flutter. 

Restart Android Studio. If nothing crashes, do yourself a favor and install the plugin Nyan Progress bar. *You'll thank us later.*

**Clone the Git Repository**

Up next is installing our code! Open up your bash terminal, navigate to a safe folder where you want to download the code and run `git clone https://github.com/PurdueHCR/Firestore.git`. Now in Android Studio, go to the top bar, File, Open, and navigate to the directory where you cloned the git repository. You want to make sure that you select the web_purduehcr folder when you press open for Android Studio. Do not open the Android folder as that will break things. If Android studio opens up and in the Project Manager on the left you see a folder called lib, you are in the right place.

**Connecting to the database**

PurdueHCR has 3 databases that can be connected and deployed to. *Production* is our live database. This has all of the data for the current state of the House Competition. *Test* is our hosted development environment. It behaves exactly like *Production*, but you can play with it however you want and trust that you won't affect the real competition. Lastly, we have the *Dev* environment. This is the environment that you run locally on your computer. This is useful when you are working on the API and the web page at the same time because you can see in real time what the output of the API is.


To connect to the database, you will need to talk to an exec member and get at least one of these files. Place these files in the folder web_purduehcr/lib/Configuration/env.
- prod.json
- test.json
- dev.json

NOTE: For each of these files that you are not sent, you will have to create, but fill with `{}`

Once you have the files downloaded, created, and saved into the env folder, go back to your bash/zsh terminal and navigate into the web_purduehcr/ directory. Run the commands
```bash
flutter pub get
flutter packages pub run build_runner build --delete-conflicting-outputs
```
This will install all of the flutter packages and create some required files to connect to the database.

*Note: If the command never stops, talk to an Exec board member about getting the compiled files. Those are test.g.dart, prod.g.dart, dev.g.dart, and config.g.dart. You can manually add test, prod, and dev to the /lib/Configuration/env folder and config to lib/Configuration/ folder.*

**Run Configuration**

We are almost done. Lastly, we need to setup the run configurations. This will let us easily switch between environments. Let's start by setting up the test environment.
1. In Android Studio, click on the button on the top bar labeled "Add Configuration". It is to the left of the Device Dropdown.
2. In the pop-up window, click on the plus button on the top left to create a new configuration. 
3. Select Flutter from the drop down menu.
4. Enter Name: "test"
5. Dart entrypoint: Click on the folder icon, and navigate to the file lib/main_test.dart. This is the entry point for our app.
6. Additional arguments: `--release --web-port 7357`
7. Click OK
8. Repeat this for every environment that you want to work in.

Now you are all set up! In the device drop down select Chrome and hit the green play button. This will launch the app, and you are now on your way to coding!

NOTE: In step 6, you tell Android Studio to run our app in release mode. This means that all print statements will only print into the Google Chrome Console and not into the console in Android Studio. Because Flutter Web is still in beta, one of the dependencies we use for the business logic has some problems running without the `--release` flag, so we trade debugging ability for stability. If you decide you want to be able to debug nativly in Android Studio, you can create a second configuration, name it "test debug" and remove the release flag from step 6.



# Other Resources
## Create a new page for the App

All pages that are not about user or account creation need to extend the BasePage class to have access to the side bar menu.

To create a BLOC for a page, look at the Random Project Notes below to see a shortcut for creating them.

To add a page to the navigation menu, you have to go to the PhcrDrawer class, add a const variable for the page and add it to the lists of permissions for user types.

Then, go to RouteGenerator and add the logic to the if statements to handle that route

## Flutter Resources 

If this is your first time working on a Flutter Project, checkout the resources below.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://flutter.dev/docs/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://flutter.dev/docs/cookbook)

For help getting started with Flutter, view our
[online documentation](https://flutter.dev/docs), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

## Random Project Notes
To build the .g files for json_serialize, run `flutter packages pub run build_runner build --delete-conflicting-outputs`

I included a tool to build the templates for a BLOC. Navigate into web_purduehcr/bloc_writer and run `python3 bloc_writer.py` You will have to move the folder into the correct directory afterwards



