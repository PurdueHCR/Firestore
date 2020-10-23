
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Utility_Views/BasePage.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_bloc/overview.dart';

import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';

class FHPOverviewPage extends BasePage {

  FHPOverviewPage({Key key}):super(key:key);

  @override
  State<StatefulWidget> createState() {
    return _FHPOverviewPageState( "Overview");
  }

}

class _FHPOverviewPageState extends BasePageState<OverviewBloc, OverviewEvent, OverviewState> {
  User user;
  OverviewBloc _overviewBloc;

  _FHPOverviewPageState(String drawerLabel):super(drawerLabel);


  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if(_overviewBloc == null){
      user = authState.user;
      Config config = ConfigWrapper.of(context);
      _overviewBloc = new OverviewBloc(config);
      _overviewBloc.add(OverviewLaunchedEvent(permissionLevel: user.permissionLevel));
    }
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, OverviewState state}) {
    return _buildBody(state);
  }


  @override
  Widget buildSmallDesktopBody({BuildContext context, OverviewState state}) {
    return _buildBody(state);
  }

  @override
  Widget buildMobileBody({BuildContext context, OverviewState state}) {
    return _buildBody(state);
  }

  Widget _buildBody(OverviewState state){
    return Center(
      child: Text("Please Build Me....."),
    );
  }

  @override
  bool isLoadingState(currentState) {
    return currentState is OverviewLoading;
  }

  @override
  OverviewBloc getBloc() {
    return _overviewBloc;
  }

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return UserPermissionSet([UserPermissionLevel.PROFESSIONAL_STAFF].toSet());
  }
}