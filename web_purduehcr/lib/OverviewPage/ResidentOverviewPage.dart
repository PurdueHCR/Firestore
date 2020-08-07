
import 'package:flutter/material.dart';
import 'package:purduehcr_web/BasePage.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/OverviewPage/overview_bloc/overview.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/HouseCompetitionCard.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/ProfileCard.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/RecentSubmissionsCard.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/RewardsCard.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:purduehcr_web/Utility_Views/PointLogChat/PointLogChat.dart';
import 'package:purduehcr_web/Utility_Views/SubmitLinkWidget/SubmitLinkWidget.dart';

import '../Config.dart';
import '../ConfigWrapper.dart';

class ResidentOverviewPage extends BasePage {
  final String linkId;

  ResidentOverviewPage({this.linkId});

  @override
  State<StatefulWidget> createState() {
    return _ResidentOverviewPageState( "Overview", linkId: linkId);
  }

}

class _ResidentOverviewPageState extends BasePageState<OverviewBloc, OverviewEvent, OverviewState> {
  User user;
  OverviewBloc _overviewBloc;
  String linkId;
  PointLog _selectedPointLog;

  _ResidentOverviewPageState(String drawerLabel, {this.linkId}):super(drawerLabel);

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
    if(state is ResidentOverviewLoaded){
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
              SizedBox(
                width: getActiveAreaWidth(context),
                height: 308,
                child:
                RecentSubmissionsCard(
                  submissions: state.logs,
                  onPressed: (PointLog log){
                   setState(() {
                     _selectedPointLog = log;
                   });
                  },
                ),
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

  List<Widget> buildInnerRow(ResidentOverviewLoaded state) {
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
  Widget buildSmallDesktopBody({BuildContext context, OverviewState state}) {
    return _buildBody(state);
  }

  @override
  Widget buildMobileBody({BuildContext context, OverviewState state}) {
    return _buildBody(state);
  }

  Widget _buildBody(OverviewState state){
    if(state is ResidentOverviewLoaded){
      if(_selectedPointLog == null){
        ResidentOverviewLoaded residentData = state;
        return SingleChildScrollView(
          child: Column(
            children: [
              SizedBox(
                width: getActiveAreaWidth(context),
                height: getActiveAreaWidth(context) * 0.3,
                child:HouseCompetitionCard(
                  houses: residentData.houses,
                  preferences: authState.preferences,
                ),
              ),
              ProfileCard(
                  user:user,
                  userRank:residentData.rank
              ),
              RewardsCard(reward: residentData.reward, house: state.myHouse,),
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