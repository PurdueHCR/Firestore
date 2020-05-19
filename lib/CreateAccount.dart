import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class CreateAccount extends StatefulWidget {
  CreateAccount({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return CreateAccountState();
  }
}

class CreateAccountState extends State<CreateAccount> {
  TextEditingController emailController = TextEditingController();
  TextEditingController password1Controller = TextEditingController();
  TextEditingController password2Controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Center(
        child: Card(
      color: Colors.white,
      child: SizedBox(
        width: 800,
        height: 500,
        child: Column(
          children: <Widget>[
            SizedBox(
              height: 20,
            ),
            Text('Create an Account',
                style: new TextStyle(
                    fontSize: 30.0,
                    color: Colors.black,
                    fontWeight: FontWeight.bold)),
            SizedBox(
              height: 20,
            ),
            TextField(
              controller: emailController,
              decoration: InputDecoration(
                  border: new UnderlineInputBorder(
                      borderSide: new BorderSide(color: Colors.black)),
                  contentPadding: const EdgeInsets.fromLTRB(50, 0, 50, 0),
                  labelText: "Email",
                  hintText: 'E-mail (Must be a valid Purdue email)'),
            ),
            SizedBox(
              height: 20,
            ),
            TextField(
              controller: password1Controller,
              decoration: InputDecoration(
                  border: new UnderlineInputBorder(
                      borderSide: new BorderSide(color: Colors.black)),
                  contentPadding: const EdgeInsets.fromLTRB(50, 0, 50, 0),
                  labelText: "Password",
                  hintText: 'Password (6 character minimum)'),
              obscureText: true,
            ),
            SizedBox(
              height: 20,
            ),
            TextField(
              controller: password2Controller,
              decoration: InputDecoration(
                  border: new UnderlineInputBorder(
                      borderSide: new BorderSide(color: Colors.black)),
                  contentPadding: const EdgeInsets.fromLTRB(50, 0, 50, 0),
                  labelText: "Confirm Password",
                  hintText: 'Confirm Password'),
              obscureText: true,
            ),
            SizedBox(
              height: 20, // fixed height
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                RaisedButton(
                    child: Text("CANCEL"),
                    onPressed: () {
                      cancel();
                    }),
                SizedBox(
                  width: 50,
                ),
                RaisedButton(
                    child: Text("SIGN UP"),
                    onPressed: () {
                      validate();
                    }),
              ],
            )
          ],
        ),
      ),
    ));
  }

  cancel() {
    Navigator.pushNamed(context, '/');
  }

  validate() {
    String email = emailController.text;
    String password1 = password1Controller.text;
    String password2 = password2Controller.text;

    if (!email.contains("@purdue.edu")) {
      showErrorPopUp("Error", "Email must be Purdue email.");
      return;
    }
    if (password1.length < 6) {
      showErrorPopUp("Error", "Password must be at least 6 characters.");
      return;
    }
    if (password1 != password2) {
      showErrorPopUp("Error", "Passwords do not match.");
      return;
    }

    signUp(context, email, password1);
  }

  Future<void> signUp(BuildContext context, String email, String password) async {

    FirebaseAuth.instance.createUserWithEmailAndPassword(email: email, password: password).then((user) {
      print("Complete");
      if(user != null){
        Navigator.pushNamed(context, '/join');
      }else{
        print("Could not sign in");
      }
    }
    ).catchError((err){
      print("ERROR: "+ err);
    });
  }


  Future<void> showErrorPopUp(String title, String description) async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(title),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text(description),
              ],
            ),
          ),
          actions: <Widget>[
            FlatButton(
              child: Text('OK'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }
}
