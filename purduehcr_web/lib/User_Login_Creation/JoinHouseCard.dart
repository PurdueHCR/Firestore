import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/OverviewPage/OverviewPage.dart';
import 'package:purduehcr_web/User_Login_Creation/JoinHousePage.dart';
import 'package:purduehcr_web/User_Login_Creation/LogInPage.dart';

class JoinHouseCard extends StatefulWidget{
  JoinHouseCard({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return JoinHouseCardState();
  }
}


class JoinHouseCardState extends State<JoinHouseCard>{

  String username;
  String password;

  TextEditingController firstNameController = TextEditingController();
  TextEditingController lastNameController = TextEditingController();
  TextEditingController houseCodeController = TextEditingController();

  void navigateToHome(){
    Navigator.of(context).pushReplacement(
        new MaterialPageRoute(builder: (context) => new HomePage())
    );
  }

  void navigateBackToLogIn(){
    Navigator.of(context).pushReplacement(
        new MaterialPageRoute(builder: (context) => new LogInPage())
    );
  }

  @override
  Widget build(BuildContext context) {

    return Card(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
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
                  controller: firstNameController,
                  decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Enter your prefered first name'
                  ),
                ),
              ),
              Padding(
                padding: EdgeInsets.fromLTRB(16, 8, 16, 16),
                child: TextField(
                  controller: lastNameController,
                  decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Enter your prefered first name'
                  ),
                ),
              ),
              Padding(
                padding: EdgeInsets.fromLTRB(16, 8, 16, 16),
                child: TextField(
                  maxLength: 6,
                  controller: houseCodeController,
                  decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Enter your House Code'
                  ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[

                  Expanded(
                      child: Padding(
                        padding: EdgeInsets.fromLTRB(16, 0, 16, 0),
                        child: RaisedButton(
                          onPressed: () {
                            navigateBackToLogIn();
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
                            navigateToHome();
                          },
                          child: Text("Join Your House"),
                        ),
                      )
                  ),

                ],
              ),
            ],
          )
        ],
      ),
    );

    // TODO: implement build
//    return Center(
//        child: Card(
//          color: Colors.blue,
//          child: SizedBox(
//            width: 200,
//            height: 200,
//            child: Column(
//              children: <Widget>[
//                TextField(
//                  decoration: InputDecoration(
//                      border: InputBorder.none,
//                      hintText: 'Preferred First Name'
//                  ),
//                ),
//                TextField(
//                  decoration: InputDecoration(
//                      border: InputBorder.none,
//                      hintText: 'Preferred Last Name'
//                  ),
//                ),
//                TextField(
//                  decoration: InputDecoration(
//                      border: InputBorder.none,
//                      hintText: 'House Code'
//                  ),
//                ),
//                RaisedButton(
//                  child: Text("Join the Purdue HCR"),
//                ),
//              ],
//            ),
//          ),
//        )
//    );
  }

}