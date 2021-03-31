
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_cards/HouseCompetitionCard.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_cards/RewardsCard.dart';
import 'package:purduehcr_web/Utility_Views/BasePage.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_bloc/overview.dart';

import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:purduehcr_web/Utility_Views/SubmitLinkWidget/SubmitLinkWidget.dart';

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
  String linkId;

  _FHPOverviewPageState(String drawerLabel, {this.linkId}):super(drawerLabel);

  @override
  void initState() {
    super.initState();
    //When the view is finished loading, handle link
    WidgetsBinding.instance
        .addPostFrameCallback((_) => handleLink());
  }

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
    if(state is FHPOverviewLoaded){
      return SingleChildScrollView(
        child: Column(
          children: [
            SizedBox(
              width: getActiveAreaWidth(context),
              height: getActiveAreaWidth(context) * 0.3,
              child:HouseCompetitionCard(
                houses: state.houses,
                preferences: authState.preferences,
              ),
            ),
            RewardsCard(reward: state.reward, house: state.myHouse,)
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
    return UserPermissionSet([UserPermissionLevel.FHP].toSet());
  }

  void handleLink(){
    if(linkId != null){
      showDialog(
          context: context,
          builder: (BuildContext context){
            return SubmitLinkWidget(linkId: linkId,);
          }
      ).then((didSubmit) {
        if(didSubmit){
          _overviewBloc.add(ReloadOverview(permissionLevel: user.permissionLevel));
        }
      });
    }
  }
}