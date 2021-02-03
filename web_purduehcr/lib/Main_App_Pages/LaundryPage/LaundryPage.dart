
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Authentication_Bloc/authentication.dart';
import 'package:purduehcr_web/Utility_Views/BasePage.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';
import 'package:purduehcr_web/Models/Link.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/LinkList.dart';


class LaundryPage extends BasePage{
  @override
  State<StatefulWidget> createState() {
    return _LaundryPageState( "Laundry");
  }

}

class _LaundryPageState extends BasePageState<AuthenticationBloc, AuthenticationEvent, AuthenticationState>{



  _LaundryPageState(String drawerLabel) : super(drawerLabel);


  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    //Setup Bloc Logic later
    // if(_linkBloc == null) {
    //   Config config = ConfigWrapper.of(context);
    //   _linkBloc = new LinkBloc(config: config);
    //   _linkBloc.add(LinkInitialize());
    // }
  }

  @override
  Widget buildMobileBody({BuildContext context, AuthenticationState state}) {
    _onChangeState(context, state);
    return buildBody(context);
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, AuthenticationState state}) {
    _onChangeState(context, state);
    return buildBody(context);
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, AuthenticationState state}) {
    _onChangeState(context, state);
    return buildBody(context);
  }

  Widget buildBody(BuildContext context){
    return Center(
      child: Text('Laundry'),
    );
  }

  @override
  AuthenticationBloc getBloc() {
    return null;
  }

  @override
  bool isLoadingState(currentState) {
    return false;
  }

  @override
  FloatingActionButton buildFloatingActionButton(BuildContext context){
    return null;
    // return FloatingActionButton(
    //   child: Icon(Icons.add),
    //   onPressed: () => _createLinkButton(context),
    // );
  }


  @override
  Widget buildLeadingButton(DisplayType displayType){
    return null;
  }

  _onChangeState(BuildContext context, AuthenticationState state){
    // if(state is CreateLinkSuccess){
    //   Navigator.pop(context);
    //   final snackBar = SnackBar(
    //     backgroundColor: Colors.green,
    //     content: Text("Your link has been created!"),
    //   );
    //   Future.delayed(Duration(seconds: 1), (){
    //     Scaffold.of(context).showSnackBar(snackBar);
    //     _linkBloc.add(LinkDisplayedMessage());
    //   });
    // }
  }

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return AllPermissionsSet();
  }

}