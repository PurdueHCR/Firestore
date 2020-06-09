import 'dart:html';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:purduehcr_web/authentication/authentication.dart';
import 'package:purduehcr_web/BasePage.dart';

import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';


class TokenTestPage extends BasePage {
  TokenTestPage({Key key}) : super(key: key){
    window.console.log("TOKEN");

  }

  @override
  State<StatefulWidget> createState() {
    return TokenTestPageState(drawerLabel: "Token");
  }

}

class TokenTestPageState extends BasePageState<AuthenticationBloc, AuthenticationEvent, AuthenticationState> {


  TokenTestPageState({@required String drawerLabel}):super(drawerLabel:drawerLabel);

  @override
  Widget buildLargeDesktopBody({BuildContext context, AuthenticationState state}) {
    return _buildBody();
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, AuthenticationState state}) {
    return _buildBody();
  }

  @override
  Widget buildMobileBody({BuildContext context, AuthenticationState state}) {
    return _buildBody();
  }

  Widget _buildBody() {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: FutureBuilder(
        future: FirebaseUtility.getToken(),
        builder: (context, snapshot) {
          if(snapshot.connectionState != ConnectionState.done){
            return _buildLoading();
          }
          else if(snapshot.hasData){
            return _buildToken(snapshot.data);
          }
          else{
            return Text("Could Not Get Token");
          }
        }
      ),
    );
  }

  Widget _buildToken(String token){
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        Text("Bearer " + token),
        RaisedButton(
          child: Text("Copy token"),
          onPressed: () {
            Clipboard.setData(ClipboardData(text: "Bearer " + token));
            final snackBar = SnackBar(
              content: Text('Copied to Clipboard'),
              action: SnackBarAction(
                label: 'Undo',
                onPressed: () {},
              ),
            );
            Scaffold.of(context).showSnackBar(snackBar);
          },
        )
      ],
    );
  }

  Widget _buildLoading(){
    return LoadingWidget();
  }

  @override
  AuthenticationBloc getBloc() {
    return authenticationBloc;
  }

  @override
  bool isLoadingState(currentState) {
    //Because we use the authentication bloc, we know that it will never be
    //AuthenticationLoading at this point in the execution
    return false;
  }

}