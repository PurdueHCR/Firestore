
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_cards/UserRankCard.dart';
import 'package:purduehcr_web/Utility_Views/BasePage.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_bloc/overview.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_cards/HouseCodesCard.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_cards/HouseCompetitionCard.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_cards/ProfileCard.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_cards/RecentSubmissionsCard.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_cards/RewardsCard.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:purduehcr_web/Utility_Views/PointLogChat/PointLogChat.dart';
import 'package:purduehcr_web/Utility_Views/SubmitLinkWidget/SubmitLinkWidget.dart';
import 'package:purduehcr_web/Utility_Views/TopBanner.dart';

import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';

class RHPOverviewPage extends BasePage {
  final String linkId;

  RHPOverviewPage({this.linkId});

  @override
  State<StatefulWidget> createState() {
    return _RHPOverviewPageState( "Overview", linkId: linkId);
  }

}

class _RHPOverviewPageState extends BasePageState<OverviewBloc, OverviewEvent, OverviewState> {
  User user;
  OverviewBloc _overviewBloc;
  String linkId;
  PointLog _selectedPointLog;

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
      if(_selectedPointLog == null){
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
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                mainAxisSize: MainAxisSize.max,
                children: buildInnerRow(state),
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
                          onPressed: (PointLog log){
                            setState(() {
                              _selectedPointLog = log;
                            });
                          },
                        ),
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
        return PointLogChat(pointLog: _selectedPointLog);
      }
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
      if(_selectedPointLog == null){
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
              ProfileCard(
                  user:user,
                  userRank:state.rank
              ),
              RewardsCard(reward: state.reward, house: state.myHouse,),
              SizedBox(
                width: getActiveAreaWidth(context),
                height: 308,
                child:RecentSubmissionsCard(
                  submissions: state.logs,
                  onPressed: (PointLog log){
                    setState(() {
                      _selectedPointLog = log;
                    });
                  },
                ),
              ),
              ConstrainedBox(
                constraints: BoxConstraints(minHeight: 300, maxHeight: 300),
                child: HouseCodesCard(
                  houseCodes: state.houseCodes,
                ),
              ),
              ConstrainedBox(
                constraints: BoxConstraints( maxHeight: 300),
                child: UserScoreCard(
                  yearScores: state.myHouse.overallScores,
                  semesterScores: state.myHouse.semesterScores,
                  key: ObjectKey(state.myHouse),
                ), //UserScoreCard
              ),
            ],
          ),
        );
      }
      else{
        return PointLogChat(pointLog: _selectedPointLog);
      }
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
  TopBanner getTopBanner() {
    if(!authState.preferences.isCompetitionEnabled){
      return TopBanner(
        color: Colors.yellow,
        message: authState.preferences.competitionDisabledMessage,
      );
    }
    else{
      return null;
    }
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

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return CompetitionParticipantsSet();
  }

  List<Widget> buildInnerRow(RHPOverviewLoaded state) {
    if(authState.preferences.showRewards && authState.preferences.isCompetitionVisible){
      return [
        ProfileCard(
            user:user,
            userRank:state.rank
        ),
        RewardsCard(reward: state.reward, house: state.myHouse,)
      ];
    }
    else{
      return [
        ProfileCard(
            user:user,
            userRank:state.rank
        )
      ];
    }
  }


  @override
  Widget buildLeadingButton(DisplayType displayType) {
    if(_selectedPointLog != null){
      return IconButton(icon: Icon(Icons.arrow_back),
          onPressed: (){
            setState(() {
              _selectedPointLog = null;
            });
          }
      );
    }
    else{
      return null;
    }
  }
}