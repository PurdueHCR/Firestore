import 'dart:html';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Account_Login_Creation/CreateAccountCard.dart';
import 'package:purduehcr_web/Account_Login_Creation/LoginCard.dart';
import 'package:purduehcr_web/Account_Login_Creation/account_bloc/account.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/authentication/authentication.dart';




class AccountPage extends StatefulWidget {

  AccountPage({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _AccountPageState();
  }

}
class _AccountPageState extends State<AccountPage> {
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

  Widget _createDesktop( AccountState state){
    return Scaffold(
        body: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Expanded(
              child: Container(
                color: Colors.blue,
              ),
            ),
            Expanded(child: Center(child: _createMobile(state)))
          ],
        ),
    );
  }

  Widget _createMobile(AccountState state){
    Widget child;
    if(state is AccountLoading){
      child = _createLoadingCard();
    }
    else if(state is AccountError){
      child = LoginCard(
        handleEvent: (AccountEvent event){
          _loginBloc.add(event);
        },
        error: state.message
      );
    }
    else if(state is CreateAccountError){
      child = CreateAccountCard(
          handleEvent: (AccountEvent event){
            _loginBloc.add(event);
          },
          error: state.message
      );
    }
    else if(state is CreateAccountInitial){
      child = CreateAccountCard(
        handleEvent: (AccountEvent event){
          _loginBloc.add(event);
        },
      );
    }
    else {
      child = LoginCard(
        handleEvent: (AccountEvent event){
        _loginBloc.add(event);
        },
      );
    }
    return Center(
      child: child,
    );
  }

  Widget _createLoadingCard(){
    return Card (
      child: CircularProgressIndicator(),
    );
  }

  @override
  void dispose() {
    super.dispose();
    _loginBloc.close();
  }
}