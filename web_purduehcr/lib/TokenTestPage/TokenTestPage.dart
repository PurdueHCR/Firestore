import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:purduehcr_web/BasePage.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';


class TokenTestPage extends BasePage {
  TokenTestPage({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return TokenTestPageState(drawerLabel: "Token");
  }

}

class TokenTestPageState extends BasePageState {

  FirebaseUtility _firebaseUtility;

  TokenTestPageState({@required String drawerLabel}):super(drawerLabel:drawerLabel){
    _firebaseUtility = FirebaseUtility(ConfigWrapper.of(context));
  }

  @override
  Widget buildDesktopBody() {
    return _buildBody();
  }

  @override
  Widget buildMobileBody() {
    return _buildBody();
  }

  Widget _buildBody() {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: FutureBuilder(
        future: _firebaseUtility.getToken(context),
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

}