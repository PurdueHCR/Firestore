import 'dart:html';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Account_Login_Creation/account_bloc/account.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/authentication/authentication.dart';



class LogInPage extends StatefulWidget {

  LogInPage({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return LogInPageState();
  }

}
class LogInPageState extends State<LogInPage> {
  AccountBloc _loginBloc;

  //Ignore close sink because it will be closed elsewhere
  // ignore: close_sinks
  AuthenticationBloc _authenticationBloc;


  @override
  void initState() {
    _authenticationBloc = BlocProvider.of<AuthenticationBloc>(context);
    window.console.log("Init State");
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _loginBloc = AccountBloc(
      config: ConfigWrapper.of(context),
      authenticationBloc: _authenticationBloc,
    );
    _loginBloc.add(AccountInitialize());
  }

  @override
  Widget build(BuildContext context) {

    final bool isDesktop = isDisplayDesktop(context);

    return Scaffold(
      backgroundColor: Color.fromARGB(255, 220, 220, 220),
      body: Container(
        padding: EdgeInsets.symmetric(vertical: 16),
        alignment: Alignment.center,
        child: BlocBuilder<AccountBloc, AccountState>(
          bloc: _loginBloc,
          builder: (context, state) {
            if(isDesktop){
              return _createDesktop(state);
            }
            else{
              return _createMobile(state);
            }
          },
        ),
      ),
    );
  }

  Widget _createDesktop(AccountState state){
    Widget child;
    if(state is AccountLoading){
      child = _createLoadingCard();
    }
    else if(state is AccountError){
      child = _createLoginCard(error: state.message);
    }
    else {
      child = _createLoginCard();
    }
    return Center(
      child: Container(
        width: MediaQuery.of(context).size.width * 0.22,
        height: MediaQuery.of(context).size.height * 0.4,
        child: child,
      ),
    );
  }

  Widget _createMobile(AccountState state){
    return _createDesktop(state);
  }

  Widget _createLoadingCard(){
    return Card (
      child: CircularProgressIndicator(),
    );
  }

  Widget _createLoginCard({String error = ""}){
    TextEditingController emailController = TextEditingController();
    TextEditingController passwordController = TextEditingController();

    return Card(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
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

          Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
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
                  visible:  error.isNotEmpty,
                  child: Padding(
                    padding: EdgeInsets.fromLTRB(16, 0, 16, 8),
                    child: Text(error,
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
                            print("Create Account");
                          },
                          child: Text("Create an account"),
                        ),
                      )
                  ),
                  Expanded(
                      child: Padding(
                        padding: EdgeInsets.fromLTRB(16, 0, 16, 0),
                        child: RaisedButton(
                          onPressed: () {
                            _loginBloc.add(Login(email: emailController.text, password: passwordController.text));
                          },
                          child:  Text("Log In"),
                        ),
                      )
                  )
                ],
              ),
              FlatButton(
                onPressed: () { print("Forgot Password"); },
                child: Text("Forgot Password"),
              )
            ],
          )
        ],
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
    _loginBloc.close();
  }
}