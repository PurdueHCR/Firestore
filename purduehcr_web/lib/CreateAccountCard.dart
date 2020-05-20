import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class CreateAccountCard extends StatefulWidget{
  CreateAccountCard({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return CreateAccountCardState();
  }
}


class CreateAccountCardState extends State<CreateAccountCard>{

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
                      hintText: 'Preferred First Name'
                  ),
                ),
                TextField(
                  decoration: InputDecoration(
                      border: InputBorder.none,
                      hintText: 'Preferred Last Name'
                  ),
                ),
                TextField(
                  decoration: InputDecoration(
                      border: InputBorder.none,
                      hintText: 'House Code'
                  ),
                ),
                RaisedButton(
                  child: Text("Join the Purdue HCR"),
                ),
              ],
            ),
          ),
        )
    );
  }

}