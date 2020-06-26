import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'account_bloc/account_event.dart';

class CreateAccountCard extends StatefulWidget{
  final Function(AccountEvent) handleEvent;
  final String error;
  CreateAccountCard({Key key, this.handleEvent, this.error = ""}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return CreateAccountCardState();
  }
}


class CreateAccountCardState extends State<CreateAccountCard>{

  TextEditingController emailController = TextEditingController();
  TextEditingController pswdController = TextEditingController();
  TextEditingController verifyPswdController = TextEditingController();

  RegExp regExp = new RegExp(
    r"[A-Z0-9a-z._%+-]+@purdue\\.edu",
  );


//  Future<void> createFirebaseAccount(BuildContext context, String email, String password) async {

//    FirebaseAuth.instance.createUserWithEmailAndPassword(email:email, password: password).then((user){
//      print("Complete");
//      if(user != null){
//        print("Success log in");
//        FirebaseAuth.instance.currentUser().then((user){
//          user.getIdToken().then((value) {
//            print("GOt token: "+value.token);
//            PHCRUser.User.user.firebaseToken = value.token;
//          })
//              .catchError((err){
//            FirebaseAuth.instance.signOut();
//            print("FAILED TO GET ID TOKEN. SO LOGGED OUT");
//          });
//
//        }).catchError((err){
//          FirebaseAuth.instance.signOut();
//          print("FAILED TO GET CURRENT USER. SO LOGGED OUT");
//        });
//        navigateToJoinHouseCard();
//      }else{
//        print("Could not sign in");
//      }
//    }
//    ).catchError((err){
//      print("ERROR: "+ err);
//    });
//  }

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

  @override
  Widget build(BuildContext context) {

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
      child: Card(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Padding(
              padding: EdgeInsets.fromLTRB(16, 25, 0, 0),
              child: Text(
                "Create Account",
                style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 32
                ),

              ),
            ),

            Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                Padding(
                  padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
                  child: TextField(
                    controller: emailController,
                    decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Enter your Purdue email address'
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.fromLTRB(16, 8, 16, 16),
                  child: TextField(
                    obscureText: true,
                    controller: pswdController,
                    decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Enter your password'
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.fromLTRB(16, 8, 16, 16),
                  child: TextField(
                    obscureText: true,
                    controller: verifyPswdController,
                    decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Verify your password'
                    ),
                  ),
                ),
                Visibility(
                    visible:  widget.error.isNotEmpty,
                    child: Padding(
                      padding: EdgeInsets.fromLTRB(16, 0, 16, 8),
                      child: Text(widget.error,
                        style: TextStyle(
                            color: Colors.red
                        ),
                      ),
                    )
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: <Widget>[

                    Expanded(
                        child: Padding(
                          padding: EdgeInsets.fromLTRB(16, 0, 16, 0),
                          child: RaisedButton(
                            onPressed: () {
                              widget.handleEvent(AccountInitialize());
                            },
                            child: Text("Back"),
                          ),
                        )
                    ),

                    Expanded(
                        child: Padding(
                          padding: EdgeInsets.fromLTRB(16, 0, 16, 0),
                          child: RaisedButton(
                            onPressed: (){
                              widget.handleEvent(CreateAccount(email: emailController.text, password:  pswdController.text, verifyPassword: verifyPswdController.text));
                            },
                            child: Text("Create an account"),
                          ),
                        )
                    ),
                  ],
                ),
              ],
            )
          ],
        ),
      ),
    );

  }

}