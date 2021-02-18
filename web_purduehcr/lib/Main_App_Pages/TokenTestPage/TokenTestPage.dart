
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Authentication_Bloc/authentication.dart';
import 'package:purduehcr_web/Utility_Views/BasePage.dart';

import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';


class TokenTestPage extends BasePage {
  TokenTestPage({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return TokenTestPageState("Token");
  }

}

class TokenTestPageState extends BasePageState<AuthenticationBloc, AuthenticationEvent, AuthenticationState> {
  TokenTestPageState(String drawerLabel) : super(drawerLabel);


  @override
  Widget buildLargeDesktopBody({BuildContext context, AuthenticationState state}) {
    return _buildBody(context);
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, AuthenticationState state}) {
    return _buildBody(context);
  }

  @override
  Widget buildMobileBody({BuildContext context, AuthenticationState state}) {
    return _buildBody(context);
  }

  Widget _buildBody(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: FutureBuilder(
        future: FirebaseUtility.getToken(),
        builder: (context, snapshot) {
          if(snapshot.connectionState != ConnectionState.done){
            return _buildLoading();
          }
          else if(snapshot.hasData){
            return _buildToken(context, snapshot.data);
          }
          else{
            return Text("Could Not Get Token");
          }
        }
      ),
    );
  }

  Widget _buildToken(BuildContext context, String token){
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        Text("Bearer " + token),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: RaisedButton(
                child: Text("Copy token for HTTP Client"),
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
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: RaisedButton(
                child: Text("Copy token for API Documentation"),
                onPressed: () {
                  Clipboard.setData(ClipboardData(text: token));
                  final snackBar = SnackBar(
                    content: Text('Copied to Clipboard'),
                    action: SnackBarAction(
                      label: 'Undo',
                      onPressed: () {},
                    ),
                  );
                  Scaffold.of(context).showSnackBar(snackBar);
                },
              ),
            )
          ],
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

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return UserPermissionSet.getAll();
  }


}