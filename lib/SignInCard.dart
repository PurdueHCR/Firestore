import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class SignInCard extends StatefulWidget{
  SignInCard({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return SignInCardState();
  }
}


class SignInCardState extends State<SignInCard>{

  String username;
  String password;

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Center(
      child: Card(
        color: Colors.blue,
        child: SizedBox(
          width: 200,
          height: 200,
          child: Column(
            children: <Widget>[
              TextField(
                decoration: InputDecoration(
                    border: InputBorder.none,
                    hintText: 'Enter your email address'
                ),
              ),
              TextField(
                decoration: InputDecoration(
                    border: InputBorder.none,
                    hintText: 'Enter your password'
                ),
              ),
              RaisedButton(
                child: Text("Log in"),
              ),
              RaisedButton(
                child: Text("Create an account"),
              )
            ],
          ),
        ),
      )
    );
  }

}