import 'package:bloc/src/bloc.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:purduehcr_web/BasePage.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';

class ControlsPage extends BasePage{
  @override
  State<StatefulWidget> createState() {
    return _ControlsPageState("Controls");
  }

}

class _ControlsPageState extends BasePageState{

  _ControlsPageState(String drawerLabel) : super(drawerLabel);

  @override
  Widget buildLargeDesktopBody({BuildContext context, state}) {
    return Column(
      children: [
        Text("Controls Page")
      ],
    );
  }

  @override
  Widget buildMobileBody({BuildContext context, state}) {
    return Column(
      children: [
        Text("Controls Page")
      ],
    );
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, state}) {
    return Column(
      children: [
        Text("Controls Page")
      ],
    );
  }

  @override
  Bloc getBloc() {
    return null;
  }

  @override
  bool isLoadingState(currentState) {
    return false;
  }

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return UserPermissionSet([UserPermissionLevel.PROFESSIONAL_STAFF].toSet());
  }

}