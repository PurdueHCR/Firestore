import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Account_Login_Creation/account_bloc/account.dart';

import 'account_bloc/account_event.dart';

class CreateAccountCard extends StatefulWidget{
  final String error;
  CreateAccountCard({Key key, this.error = ""}) : super(key: key);

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
  AccountBloc _accountBloc;

  @override
  void initState() {
    super.initState();
    _accountBloc = BlocProvider.of<AccountBloc>(context);
  }

  @override
  Widget build(BuildContext context) {

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
      child: Card(
        child: SingleChildScrollView(
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
                            padding: EdgeInsets.all(16),
                            child: RaisedButton(
                              onPressed: () {
                                _accountBloc.add(AccountInitialize());
                              },
                              child: Text("Back"),
                            ),
                          )
                      ),

                      Expanded(
                          child: Padding(
                            padding: EdgeInsets.all(16),
                            child: RaisedButton(
                              onPressed: (){
                                _accountBloc.add(CreateAccount(email: emailController.text, password:  pswdController.text, verifyPassword: verifyPswdController.text));
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
      ),
    );

  }

}