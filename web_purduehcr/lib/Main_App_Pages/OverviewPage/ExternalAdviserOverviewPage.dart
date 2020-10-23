import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_cards/HouseCompetitionCard.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_cards/HouseDescription.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_cards/HousePointTypeSubmissionsCard.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_cards/RewardsCard.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_cards/UserRankCard.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Utility_Views/BasePage.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_bloc/overview.dart';

import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';

class ExternalAdviserOverviewPage extends BasePage {
  ExternalAdviserOverviewPage({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _ExternalAdviserOverviewPageState("Overview");
  }
}

class _ExternalAdviserOverviewPageState
    extends BasePageState<OverviewBloc, OverviewEvent, OverviewState> {
  User user;
  OverviewBloc _overviewBloc;
  House _selectedHouse;

  _ExternalAdviserOverviewPageState(String drawerLabel) : super(drawerLabel);

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_overviewBloc == null) {
      print("Did change dep");
      user = authState.user;
      Config config = ConfigWrapper.of(context);
      _overviewBloc = new OverviewBloc(config);
      _overviewBloc.add(OverviewLaunchedEvent(permissionLevel: user.permissionLevel));
    }
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, OverviewState state}) {
    print("Building large");
    if(state is ExternalAdviserLoaded){
      if(_selectedHouse == null)
        _selectedHouse = state.houses[0];


      return SingleChildScrollView(
        child: Column(
          children: [
            SizedBox(
              width: getActiveAreaWidth(context),
              height: getActiveAreaWidth(context) * 0.3,
              child:HouseCompetitionCard(
                houses: state.houses,
              ),
            ),
          ],
        ),
      );
    }
    else{
      return LoadingWidget();
    }
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, OverviewState state}) {
    print("Building small");
    return _buildBody(state);
  }

  @override
  Widget buildMobileBody({BuildContext context, OverviewState state}) {
    print("Building mobile");
    return _buildBody(state);
  }

  Widget _buildBody(OverviewState state) {
    if(state is ExternalAdviserLoaded){
      if(_selectedHouse == null)
        _selectedHouse = state.houses[0];

      return SingleChildScrollView(
        child: Column(
          children: [
            SizedBox(
              width: getActiveAreaWidth(context),
              height: getActiveAreaWidth(context) * 0.3,
              child:HouseCompetitionCard(
                houses: state.houses,
              ),
            ),
          ],
        ),
      );
    }
    else{
      return LoadingWidget();
    }
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
    return UserPermissionSet([UserPermissionLevel.EXTERNAL_ADVISER].toSet());
  }
}
