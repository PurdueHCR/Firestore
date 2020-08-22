import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Account_Login_Creation/account_bloc/account.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';

class LoginCard extends StatefulWidget {
  final String error;

  const LoginCard({Key key, this.error = ""}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _LoginCardState();
  }
}

class _LoginCardState extends State<LoginCard> {
  AccountBloc _accountBloc;
  final _passwordResetKey = GlobalKey<FormState>();
  TextEditingController passwordResetController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _accountBloc = BlocProvider.of<AccountBloc>(context);
  }

  @override
  Widget build(BuildContext context) {
    TextEditingController emailController = TextEditingController();
    TextEditingController passwordController = TextEditingController();
    if (_accountBloc.state is AccountPageLoading) {
      return LoadingWidget();
    } else {
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
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 32),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
                  child: TextField(
                    controller: emailController,
                    decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Enter your email address'),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.fromLTRB(16, 8, 16, 16),
                  child: TextField(
                    obscureText: true,
                    controller: passwordController,
                    decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Enter your password'),
                  ),
                ),
                Visibility(
                    visible: widget.error.isNotEmpty,
                    child: Padding(
                      padding: EdgeInsets.fromLTRB(16, 0, 16, 8),
                      child: Text(
                        widget.error,
                        style: TextStyle(color: Colors.red),
                      ),
                    )),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: <Widget>[
                    Expanded(
                      child: Padding(
                        padding: EdgeInsets.fromLTRB(16, 0, 16, 0),
                        child: RaisedButton(
                          onPressed: () {
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
                            _accountBloc.add(SetAccountPageLoading());
                            _accountBloc.add(Login(
                              email: emailController.text,
                              password: passwordController.text,
                            ));
                          },
                          child: Text("Log In"),
                        ),
                      ),
                    )
                  ],
                ),
                FlatButton(
                  child: Text("Forgot Password"),
                  onPressed: () {
                    showDialog(
                        context: context,
                        builder: (BuildContext context) {
                          return AlertDialog(
                            title: Text("Reset Password"),
                            content: Form(
                              key: _passwordResetKey,
                              child: ConstrainedBox(
                                constraints: BoxConstraints(maxWidth: 300),
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                        "To reset your password, enter your account email below. If it exists, we will send you an email with a link to reset your password."),
                                    Padding(
                                      padding: const EdgeInsets.fromLTRB(0, 8, 0, 0),
                                      child: TextFormField(
                                        decoration: InputDecoration(
                                            border: OutlineInputBorder(),
                                            labelText:
                                                'Enter the email linked to your account',
                                            counterText: ''
                                        ),
                                        maxLength: 100,
                                        controller: passwordResetController,
                                        keyboardType:
                                            TextInputType.emailAddress,
                                        autofillHints: [AutofillHints.email],
                                        validator: (value) {
                                          RegExp regExp = new RegExp(
                                            r"[A-Z0-9a-z._%+-]+@purdue\.edu",
                                          );
                                          if (value.isEmpty) {
                                            return 'Please enter an email address';
                                          } else if (!regExp.hasMatch(value)) {
                                            return 'Please enter a valid purdue email address';
                                          }
                                          return null;
                                        },
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            actions: [
                              RaisedButton(
                                child: Text("Cancel"),
                                onPressed: () {
                                  Navigator.of(context).pop();
                                },
                              ),
                              RaisedButton(
                                child: Text("Request Email"),
                                onPressed: () {
                                  if (_passwordResetKey.currentState
                                      .validate()) {
                                    _accountBloc.add(SendPasswordResetEmail(
                                        passwordResetController.text));
                                    Navigator.of(context).pop();
                                  }
                                },
                              )
                            ],
                          );
                        });
                  },
                )
              ],
            ),
          ),
        ),
      );
    }
  }
}
