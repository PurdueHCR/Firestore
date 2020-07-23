
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/HouseCodePage/house_code_bloc/house_code.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/BasePage.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/HouseCodeList.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';



class HouseCodePage extends BasePage {
  HouseCodePage({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _HouseCodePageState("House Codes");
  }

}

class _HouseCodePageState extends BasePageState<HouseCodeBloc, HouseCodeEvent, HouseCodeState> {
  _HouseCodePageState(String drawerLabel) : super(drawerLabel);

  HouseCodeBloc _houseCodeBloc;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if(_houseCodeBloc == null) {
      Config config = ConfigWrapper.of(context);
      _houseCodeBloc = new HouseCodeBloc(config: config);
      _houseCodeBloc.add(HouseCodeInitialize());
    }
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, HouseCodeState state}) {
    return _buildBody(context, state);
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, HouseCodeState state}) {
    return _buildBody(context, state);
  }

  @override
  Widget buildMobileBody({BuildContext context, HouseCodeState state}) {
    return _buildBody(context, state);
  }

  Widget _buildBody(BuildContext context, HouseCodeState state) {
    if(state is HouseCodeLoadingError){
      return Column(
        children: [
          Center(
              child: Text("There was an error loading the house codes.")
          )
        ],
      );
    }
    else if (state is RefreshingHouseCodes){
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            width: 40,
            height: 40,
            child: LoadingWidget()
          ),
          Text("This may take a minute...")
        ],
      );
    }
    else{
      return HouseCodeList(
        houseCodes: state.houseCodes,
        onPressed: (context, code){
          Clipboard.setData(ClipboardData(text: code.dynamicLink));
          final snackBar = SnackBar(
            content: Text('Copied Link to Join House'),
          );
          Scaffold.of(context).showSnackBar(snackBar);
        },
        onSwipe: (code){
          code.code = null;
          _houseCodeBloc.add(RefreshCode(code));
        },
      );
    }
  }

  @override
  HouseCodeBloc getBloc() {
    return _houseCodeBloc;
  }

  @override
  bool isLoadingState(currentState) {
    return currentState is HouseCodePageLoading;
  }

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return UserPermissionSet([UserPermissionLevel.PROFESSIONAL_STAFF].toSet());
  }

  @override
  List<Widget> buildActions(DisplayType displayType){
    return [
      IconButton(
        icon: Icon(Icons.refresh),
        onPressed: (){
          showDialog(
            context: context,
            builder: (BuildContext context) {
              // return object of type Dialog
              return AlertDialog(
                title: new Text("Refresh House Codes"),
                content: new Text("Are you sure you want to refresh all the house codes? This will generate new links as well."),
                actions: <Widget>[
                  // usually buttons at the bottom of the dialog
                  new FlatButton(
                    child: new Text("Close"),
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                  ),
                  new RaisedButton(
                    child: new Text("Refresh"),
                    onPressed: () {
                      _houseCodeBloc.add(RefreshAllCodes());
                      Navigator.of(context).pop();
                    },
                  ),
                ],
              );
            },
          );
        },
      )
    ];
  }

  @override
  void dispose() {
    super.dispose();
    _houseCodeBloc.close();
  }

}