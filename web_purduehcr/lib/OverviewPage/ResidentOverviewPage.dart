
import 'dart:html';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/BasePage.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/OverviewPage/overview_bloc/overview.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/HouseCompetitionCard.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/ProfileCard.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/RecentSubmissionsCard.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/RewardsCard.dart';

import '../Config.dart';
import '../ConfigWrapper.dart';

class ResidentOverviewPage extends BasePage {
  @override
  State<StatefulWidget> createState() {
    window.console.log("Create State Resident Overview Page");
    return _ResidentOverviewPageState(drawerLabel: "Overview");
  }

}

class _ResidentOverviewPageState extends BasePageState<OverviewBloc, OverviewEvent, OverviewState> {
  User user;
  OverviewBloc _overviewBloc;

  _ResidentOverviewPageState({@required String drawerLabel}):super(drawerLabel:drawerLabel);

  @override
  void initState() {
    super.initState();
    user = authState.user;
    Config config = ConfigWrapper.of(context);
    _overviewBloc = new OverviewBloc(config);
    _overviewBloc.add(OverviewLaunchedEvent(permissionLevel: user.permissionLevel));
  }

  @override
  Widget buildLargeDesktopBody() {
    return _buildBody();
  }

  @override
  Widget buildSmallDesktopBody() {
    return _buildBody();
  }

  @override
  Widget buildMobileBody() {
    return _buildBody();
  }

  Widget _buildBody(){
    ResidentOverviewLoaded residentData = _overviewBloc.state;
    return Wrap(
      children: [
        SizedBox(
          width: 500,
          child: ProfileCard(
              user:user,
              userRank:residentData.rank
          ),
        ),
        SizedBox(
          width: 500,
          child: RewardsCard(
            reward: residentData.reward,
            house: getUserHouse(user,residentData.houses),
          ),
        ),
        SizedBox(
          width: 500,
          child: RecentSubmissionsCard(
            submissions: residentData.logs,
          ),
        ),
        SizedBox(
          width: 500,
          child: HouseCompetitionCard(
            houses: residentData.houses,
          ),
        )
      ],
    );
  }

  @override
  bool isLoadingState(currentState) {
    return currentState is OverviewLoading;
  }

  @override
  OverviewBloc getBloc() {
    window.console.log("Request bloc");
    return _overviewBloc;
  }

  House getUserHouse(User user, List<House> houses){
    for( House house in houses){
      if(house.name == user.house){
        return house;
      }
    }
    window.console.error("Could not find User House");
    return houses[0];
  }
}