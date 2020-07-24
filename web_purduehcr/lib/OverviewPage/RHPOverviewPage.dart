
import 'package:flutter/material.dart';
import 'package:purduehcr_web/BasePage.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/OverviewPage/overview_bloc/overview.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/HouseCodesCard.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/HouseCompetitionCard.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/ProfileCard.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/RecentSubmissionsCard.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/RewardsCard.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:purduehcr_web/Utility_Views/SubmitLinkWidget/SubmitLinkWidget.dart';

import '../Config.dart';
import '../ConfigWrapper.dart';

class RHPOverviewPage extends BasePage {
  final String linkId;

  RHPOverviewPage({this.linkId});

  @override
  State<StatefulWidget> createState() {
    print("Create State RHP Overview Page");
    return _RHPOverviewPageState( "Overview", linkId: linkId);
  }

}

class _RHPOverviewPageState extends BasePageState<OverviewBloc, OverviewEvent, OverviewState> {
  User user;
  OverviewBloc _overviewBloc;
  String linkId;

  _RHPOverviewPageState(String drawerLabel, {this.linkId}):super(drawerLabel);

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
    if(state is RHPOverviewLoaded){
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
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              mainAxisSize: MainAxisSize.max,
              children: [
                ProfileCard(
                    user:user,
                    userRank:state.rank
                ),
                RewardsCard(reward: state.reward, house: getUserHouse(user, state.houses),)
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.max,
              children: [
                Expanded(
                    child: ConstrainedBox(
                        constraints: BoxConstraints(minHeight: 300, maxHeight: 300),
                        child: RecentSubmissionsCard(
                          submissions: state.logs,
                        )
                    )
                ),
                Expanded(
                  child: ConstrainedBox(
                    constraints: BoxConstraints(minHeight: 300, maxHeight: 300),
                    child: HouseCodesCard(
                      houseCodes: state.houseCodes,
                    ),
                  ),
                )
              ],
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
    return _buildBody(state);
  }

  @override
  Widget buildMobileBody({BuildContext context, OverviewState state}) {
    return _buildBody(state);
  }

  Widget _buildBody(OverviewState state){
    if(state is RHPOverviewLoaded){
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
            ProfileCard(
                user:user,
                userRank:state.rank
            ),
            RewardsCard(reward: state.reward, house: getUserHouse(user, state.houses),),
            SizedBox(
              width: getActiveAreaWidth(context),
              height: 308,
              child:RecentSubmissionsCard(submissions: state.logs,),
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

  House getUserHouse(User user, List<House> houses){
    for( House house in houses){
      if(house.name == user.house){
        return house;
      }
    }
    return houses[0];
  }

  void handleLink(){
    if(linkId != null){
      showDialog(
          context: context,
          builder: (BuildContext context){
            return SubmitLinkWidget(linkId: linkId,);
          }
      ).then((didSubmit) {
        print("GOT VALUE BACK: $didSubmit");
        if(didSubmit){
          _overviewBloc.add(ReloadOverview(permissionLevel: user.permissionLevel));
        }
      });
    }
  }

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return CompetitionParticipantsSet();
  }
}