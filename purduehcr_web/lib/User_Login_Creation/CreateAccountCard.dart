//import 'package:firebase_auth/firebase_auth.dart';
//import 'package:flutter/cupertino.dart';
//import 'package:flutter/material.dart';
//import 'package:purduehcr_web/User_Login_Creation/JoinHousePage.dart';
//import 'package:purduehcr_web/Login/LogInPage.dart';
//import 'package:purduehcr_web/Models/User.dart' as PHCRUser;
//
//class CreateAccountCard extends StatefulWidget{
//  CreateAccountCard({Key key}) : super(key: key);
//
//  @override
//  State<StatefulWidget> createState() {
//    // TODO: implement createState
//    return CreateAccountCardState();
//  }
//}
//
//
//class CreateAccountCardState extends State<CreateAccountCard>{
//
//  TextEditingController emailController = TextEditingController();
//  TextEditingController pswdController = TextEditingController();
//  TextEditingController verifyPswdController = TextEditingController();
//
//  RegExp regExp = new RegExp(
//    r"[A-Z0-9a-z._%+-]+@purdue\\.edu",
//  );
//
//  void navigateToJoinHouseCard(){
//    Navigator.of(context).pushReplacement(
//        new MaterialPageRoute(builder: (context) => new JoinHousePage())
//    );
//  }
//
//  void navigateBackToLogIn(){
//    Navigator.of(context).pushReplacement(
//        new MaterialPageRoute(builder: (context) => new LogInPage())
//    );
//  }
//
//  Future<void> createFirebaseAccount(BuildContext context, String email, String password) async {
//
////    FirebaseAuth.instance.createUserWithEmailAndPassword(email:email, password: password).then((user){
////      print("Complete");
////      if(user != null){
////        print("Success log in");
////        FirebaseAuth.instance.currentUser().then((user){
////          user.getIdToken().then((value) {
////            print("GOt token: "+value.token);
////            PHCRUser.User.user.firebaseToken = value.token;
////          })
////              .catchError((err){
////            FirebaseAuth.instance.signOut();
////            print("FAILED TO GET ID TOKEN. SO LOGGED OUT");
////          });
////
////        }).catchError((err){
////          FirebaseAuth.instance.signOut();
////          print("FAILED TO GET CURRENT USER. SO LOGGED OUT");
////        });
////        navigateToJoinHouseCard();
////      }else{
////        print("Could not sign in");
////      }
////    }
////    ).catchError((err){
////      print("ERROR: "+ err);
////    });
//  }
//
//  void createAccount(){
//    if(!regExp.hasMatch(emailController.toString())){
//      //Invalid Email
//    }
//    else if(pswdController.toString() != verifyPswdController.toString()){
//      //Passwrods need to match
//    }
//    else{
//      createFirebaseAccount(context, emailController.toString(), pswdController.toString());
//    }
//
//  }
//
//  @override
//  Widget build(BuildContext context) {
//
//    return Card(
//      child: Column(
//        mainAxisAlignment: MainAxisAlignment.center,
//        crossAxisAlignment: CrossAxisAlignment.start,
//        children: <Widget>[
//          Padding(
//            padding: EdgeInsets.fromLTRB(16, 25, 0, 0),
//            child: Text(
//              "Create Account",
//              style: TextStyle(
//                  fontWeight: FontWeight.bold,
//                  fontSize: 32
//              ),
//
//            ),
//          ),
//
//          Column(
//            crossAxisAlignment: CrossAxisAlignment.center,
//            children: <Widget>[
//              Padding(
//                padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
//                child: TextField(
//                  controller: emailController,
//                  decoration: InputDecoration(
//                      border: OutlineInputBorder(),
//                      labelText: 'Enter your Purdue email address'
//                  ),
//                ),
//              ),
//              Padding(
//                padding: EdgeInsets.fromLTRB(16, 8, 16, 16),
//                child: TextField(
//                  obscureText: true,
//                  controller: pswdController,
//                  decoration: InputDecoration(
//                      border: OutlineInputBorder(),
//                      labelText: 'Enter your password'
//                  ),
//                ),
//              ),
//              Padding(
//                padding: EdgeInsets.fromLTRB(16, 8, 16, 16),
//                child: TextField(
//                  obscureText: true,
//                  controller: verifyPswdController,
//                  decoration: InputDecoration(
//                      border: OutlineInputBorder(),
//                      labelText: 'Verify your password'
//                  ),
//                ),
//              ),
//              Row(
//                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
//                children: <Widget>[
//
//                  Expanded(
//                      child: Padding(
//                        padding: EdgeInsets.fromLTRB(16, 0, 16, 0),
//                        child: RaisedButton(
//                          onPressed: () {
//                            navigateBackToLogIn();
//                          },
//                          child: Text("Back"),
//                        ),
//                      )
//                  ),
//
//                  Expanded(
//                      child: Padding(
//                        padding: EdgeInsets.fromLTRB(16, 0, 16, 0),
//                        child: RaisedButton(
//                          onPressed: (){
//                            createAccount();
//                          },
//                          child: Text("Create an account"),
//                        ),
//                      )
//                  ),
//                ],
//              ),
//            ],
//          )
//        ],
//      ),
//    );
//
//  }
//
//}