import 'dart:convert';

import 'package:firebase/firebase.dart' as fb;
import 'package:firebase/firebase.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/User.dart' as  PHCRUser;


class FirebaseUtility{

  static FirebaseUtility instance = new FirebaseUtility();
  static App app;

  bool connectedToDatabase = false;

  static Future<void> initializeFirebase(BuildContext context){
    if(fb.apps.isEmpty && app == null){
      debugPrint("No App, so initialize Firebase");
      return DefaultAssetBundle.of(context).loadString("assets/flutter-firebase-config.json").then((data){
        final projectInfo = json.decode(data)["project_info"];
        try {
          app = fb.initializeApp(
              apiKey: projectInfo["apiKey"],
              authDomain: projectInfo["authDomain"],
              databaseURL: projectInfo["databaseURL"],
              projectId: projectInfo["projectId"],
              storageBucket: projectInfo["storageBucket"]);
        }
        catch (err){
          debugPrint("We are ignoring this error");
        }
        return fb.auth().setPersistence(fb.Persistence.SESSION);
      }).catchError((onError) {
        debugPrint("error: "+onError);
        return Future.error(onError);
      });
    }
    else{
      return Future.value();
    }
  }

  ///Signs in the user and returns the token in the future
  static Future<String> signIn(BuildContext context, String email, String password){
    return initializeFirebase(context).then((_) async {
      try{
        final user = await FirebaseAuth.instance.signInWithEmailAndPassword(email:email, password: password);
        if(user != null){
          return _getToken(context);
        }
        else{
          return Future.error("Account Does Not Exist");
        }
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

  static Future<String> _getToken(BuildContext context){
    return initializeFirebase(context).then((_){
      return FirebaseAuth.instance.currentUser().then((user) {
        return user.getIdToken(refresh: false).then((value) {
          return Future.value(value.token);
        });
      });
    });
  }

  ///
  static Future<void> getCurrentUser(BuildContext context){
    return initializeFirebase(context).then((_){
      return FirebaseAuth.instance.currentUser().then((user){
        if(user == null){
          debugPrint("SINGLE CHECK NOT SIGNED IN: Return to login please");
          return Future.error("User not signed in");
        }
        else{
          return _getToken(context);
        }
      });
    });
  }

  static Future<void> logout(){
    return FirebaseAuth.instance.signOut();
  }

}