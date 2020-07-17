
import 'package:firebase/firebase.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Config.dart';


class FirebaseUtility{
  static App app;
  static bool connectedToDatabase = false;


  static Future<void> initializeFirebase(Config config){
    if(apps.isEmpty ){
      try {
        app = initializeApp(
            apiKey: config.apiKey,
            authDomain: config.authDomain,
            databaseURL: config.databaseURL,
            projectId: config.projectId,
            storageBucket: config.storageBucket);
      }
      catch (err){
        debugPrint("We are ignoring this error");
      }
      return auth().setPersistence(Persistence.SESSION);
    }
    else{
      return Future.value();
    }
  }

  ///Signs in the user and returns the token in the future
  static Future<void> signIn(Config config, String email, String password){
    return initializeFirebase(config).then((_) async {
      try{
        await FirebaseAuth.instance.signInWithEmailAndPassword(email:email, password: password);
      }
      catch(error){
        String errorMessage;
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "Your email address appears to be malformed.";
            break;
          case "auth/wrong-password":
            errorMessage = "Please verify your email and password";
            break;
          case "auth/user-not-found":
            errorMessage = "Please verify your email and password";
            break;
          case "auth/user-disabled":
            errorMessage = "User with this email has been disabled.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many requests. Try again later.";
            break;
          case "auth/operation-not-allowed":
            errorMessage = "Signing in with Email and Password is not enabled.";
            break;
          case "auth/id-token-revoked":
          case "auth/id-token-expired":
            print("The app's auth token is expired. This is bad. Please contact the Honors College Development Committee about updating the auth token.");
            errorMessage = "Uh oh, there was a problem. Please try again later.";
            break;
          default:
            print("There was an unknown problem with the connection to Google's server. If the problem persists, please send this code to the Honors College Development Committee: ${error.code}");
            errorMessage = "Uh oh, there was a problem. Please try again later.";
            break;
        }
        return Future.error(errorMessage);
      }
    });
  }

  static Future createAccount(Config config, String email, String password){
    return initializeFirebase(config).then((value) async {
      try{
        await FirebaseAuth.instance.createUserWithEmailAndPassword(email: email, password: password);
      }
      catch(error){
        return Future.error(error.code);
      }
    });
  }


  static Future<String> getToken(){
    return FirebaseAuth.instance.currentUser().then((user) {
      return user.getIdToken(refresh: false).then((value) {
        return Future.value(value.token);
      });
    });
  }


  static Future<void> logout(){
    return FirebaseAuth.instance.signOut();
  }

}