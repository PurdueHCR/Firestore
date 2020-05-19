import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:purduehcr_web/BasePage.dart';


class TokenTestPage extends BasePage {
  TokenTestPage({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return TokenTestPageState(drawerLabel: "Token");
  }

}

class TokenTestPageState extends BasePageState {

  TokenTestPageState({@required String drawerLabel}):super(drawerLabel:drawerLabel);

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
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          Text("Bearer " + auth.token),
          RaisedButton(
            child: Text("Copy token"),
            onPressed: () {
              print("Please try to print");
              Clipboard.setData(ClipboardData(text: "Bearer " + auth.token));
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
      ),
    );
  }


}