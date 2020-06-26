
import 'dart:html';

import 'package:firebase/firebase.dart' as fb;
import 'package:firebase/firebase.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Config.dart';


class FirebaseUtility{
  static App app;
  static bool connectedToDatabase = false;


  static Future<void> initializeFirebase(Config config){
    if(fb.apps.isEmpty ){
      debugPrint("No App, so initialize Firebase");
      try {
        app = fb.initializeApp(
            apiKey: config.apiKey,
            authDomain: config.authDomain,
            databaseURL: config.databaseURL,
            projectId: config.projectId,
            storageBucket: config.storageBucket);
      }
      catch (err){
        debugPrint("We are ignoring this error");
      }
      return fb.auth().setPersistence(fb.Persistence.SESSION);
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
        window.console.log("Sign in error code: ${error.code}");
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
          default:
            errorMessage = error.toString();
        }
        return Future.error(errorMessage);
      }
    });
  }

  static Future<void> createAccount(Config config, String email, String password){
    return initializeFirebase(config).then((value) async {
      try{
        await FirebaseAuth.instance.createUserWithEmailAndPassword(email: email, password: password);
      }
      catch(error){
        String errorMessage;
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "This email address is already being used";
            break;
          case "auth/invalid-email":
            errorMessage = "This is not a valid email";
            break;
          case "auth/operation-not-allowed":
            errorMessage = "For Some reason you cant do this? Try again later and if a problem persists, talk to an RA.";
            break;
          case "auth/weak-password":
            errorMessage = "Your password is not strong enough. Please create a different one.";
            break;
          default:
            errorMessage = error.toString();
        }
        return Future.error(errorMessage);
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