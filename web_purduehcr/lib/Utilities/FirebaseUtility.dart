import 'dart:convert';

import 'package:firebase/firebase.dart' as fb;
import 'package:firebase/firebase.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Config.dart';


class FirebaseUtility{

  final Config config;
  static App app;
  bool connectedToDatabase = false;

  FirebaseUtility(this.config);

  Future<void> initializeFirebase(){
    if(fb.apps.isEmpty && app == null){
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
  Future<void> signIn(String email, String password){
    return initializeFirebase().then((_) async {
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
          default:
            errorMessage = error.toString();
        }
        return Future.error(errorMessage);
      }
    });
  }


  Future<String> getToken(BuildContext context){
    return initializeFirebase().then((_){
      return FirebaseAuth.instance.currentUser().then((user) {
        return user.getIdToken(refresh: false).then((value) {
          return Future.value(value.token);
        });
      });
    });
  }


  static Future<void> logout(){
    return FirebaseAuth.instance.signOut();
  }

}