import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Account_Login_Creation/account_bloc/account.dart';

class LoginCard extends StatefulWidget{

  final String error;

  const LoginCard({Key key, this.error = ""}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _LoginCardState();
  }

}

class _LoginCardState extends State<LoginCard>{


  AccountBloc _accountBloc;


  @override
  void initState() {
    super.initState();
    _accountBloc = BlocProvider.of<AccountBloc>(context);
  }

  @override
  Widget build(BuildContext context) {
    TextEditingController emailController = TextEditingController();
    TextEditingController passwordController = TextEditingController();

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
                  "Log in",
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 32
                  ),

                ),
              ),
              Padding(
                padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
                child: TextField(
                  controller: emailController,
                  decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Enter your email address'
                  ),
                ),
              ),
              Padding(
                padding: EdgeInsets.fromLTRB(16, 8, 16, 16),
                child: TextField(
                  obscureText: true,
                  controller: passwordController,
                  decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Enter your password'
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
                        onPressed: (){
                          _accountBloc.add(CreateAccountInitialize());
                        },
                        child: Text("Create an account"),
                      ),
                    ),
                  ),
                  Expanded(
                    child: Padding(
                      padding: EdgeInsets.fromLTRB(16, 0, 16, 0),
                      child: RaisedButton(
                        onPressed: () {
                          _accountBloc.add(Login(email: emailController.text, password: passwordController.text, ));
                        },
                        child:  Text("Log In"),
                      ),
                    ),
                  )
                ],
              ),
              FlatButton(
                onPressed: () { print("Forgot Password"); },
                child: Text("Forgot Password"),
              )
            ],
          ),
        ),
      ),
    );
  }

}