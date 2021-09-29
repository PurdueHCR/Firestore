
import 'dart:convert';

import 'package:firebase/firebase.dart';
import 'package:firebase_auth/firebase_auth.dart' as fb_auth;
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:firebase/firebase.dart' as fb;
import 'package:purduehcr_web/Models/ApiError.dart';


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
        print("We are ignoring this error: $err");
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
        await fb_auth.FirebaseAuth.instance.signInWithEmailAndPassword(email:email, password: password);
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
        throw ApiError(400, errorMessage);
      }
    });
  }

  static Future<void> createAccount(Config config, String email, String password){
    return initializeFirebase(config).then((value) async {
      try{
        await fb_auth.FirebaseAuth.instance.createUserWithEmailAndPassword(email: email, password: password);
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
    return fb_auth.FirebaseAuth.instance.currentUser.getIdToken().then((value) {
        return Future.value(value);
      });
  }

  static sendPasswordResetEmail(String email) async{
    try{
      await fb_auth.FirebaseAuth.instance.sendPasswordResetEmail(email: email);
    }
    catch(error){
      if(error.code != "auth/user-not-found"){
        throw error;
      }
    }
  }


  static Future<void> logout(){
    return fb_auth.FirebaseAuth.instance.signOut();
  }

  static Future deleteImageFromStorage(String filePath){
    return fb.storage().ref('/').child(filePath).delete();
  }

}