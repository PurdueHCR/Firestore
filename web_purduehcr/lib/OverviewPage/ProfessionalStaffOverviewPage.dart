
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/BasePage.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/OverviewPage/overview_bloc/overview.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/HouseCompetitionCard.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/HouseDescription.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/HousePointTypeSubmissionsCard.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/ProfileCard.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/RecentSubmissionsCard.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/RewardsCard.dart';
import 'package:purduehcr_web/OverviewPage/overview_cards/UserRankCard.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:purduehcr_web/Utility_Views/SubmitLinkWidget/SubmitLinkWidget.dart';

import '../Config.dart';
import '../ConfigWrapper.dart';

class ProfessionalStaffOverviewPage extends BasePage {

  ProfessionalStaffOverviewPage();

  @override
  State<StatefulWidget> createState() {
    return _ProfessionalStaffOverviewPageState( "Overview");
  }

}

class _ProfessionalStaffOverviewPageState extends BasePageState<OverviewBloc, OverviewEvent, OverviewState> {
  User user;
  OverviewBloc _overviewBloc;
  House _selectedHouse;

  _ProfessionalStaffOverviewPageState(String drawerLabel):super(drawerLabel);

  @override
  void initState() {
    super.initState();
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
    checkForMessage(context, state);
    if(state is ProfessionalStaffLoaded){
      if(_selectedHouse == null)
        _selectedHouse = state.houses[0];

      List<Widget> buttons = [];
      for(House house in state.houses){
        if(house == _selectedHouse){
          buttons.add(RaisedButton(
            color: house.getHouseColor(),
            child: Text(house.name),
            onPressed: (){
              setState(() {
                _selectedHouse = house;
              });
            },
          ));
        }
        else{
          buttons.add(OutlineButton(
            color: house.getHouseColor(),
            child: Text(house.name),
            onPressed: (){
              setState(() {
                _selectedHouse = house;
              });
            },
          ));
        }
      }

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
            Wrap(
              children: buttons,
            ),
            Row(
              children: [
                Expanded(
                  child: ConstrainedBox(
                    constraints: BoxConstraints(minHeight: 350, maxHeight: 350),
                    child: BlocProvider(
                      builder: (BuildContext context) => _overviewBloc,
                      child: HouseDescription(
                        key: ObjectKey(_selectedHouse),
                        house: _selectedHouse,
                        permissionLevel: authState.user.permissionLevel,
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: ConstrainedBox(
                    constraints: BoxConstraints(minHeight: 350, maxHeight: 350),
                    child: UserScoreCard(
                      yearScores: _selectedHouse.overallScores,
                      semesterScores: _selectedHouse.semesterScores,
                      key: ObjectKey(_selectedHouse),
                    ),
                  ),
                )
              ],
            ),
            ConstrainedBox(
              constraints: BoxConstraints( maxHeight: 300),
              child: HousePointTypeSubmissionsCard(
                key: ObjectKey(_selectedHouse),
                submissions: _selectedHouse.submissions,
              ),
            )
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
    checkForMessage(context, state);
    if(state is ProfessionalStaffLoaded){
      if(_selectedHouse == null)
        _selectedHouse = state.houses[0];

      List<Widget> buttons = [];
      for(House house in state.houses){
        if(house == _selectedHouse){
          buttons.add(RaisedButton(
            color: house.getHouseColor(),
            child: Text(house.name),
            onPressed: (){
              setState(() {
                _selectedHouse = house;
              });
            },
          ));
        }
        else{
          buttons.add(OutlineButton(
            color: house.getHouseColor(),
            child: Text(house.name),
            onPressed: (){
              setState(() {
                _selectedHouse = house;
              });
            },
          ));
        }
      }

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
            Wrap(
              children: buttons,
            ),
            ConstrainedBox(
              constraints: BoxConstraints( maxHeight: 300),
              child: BlocProvider(
                builder: (BuildContext context) => _overviewBloc,
                child: HouseDescription(
                  key: ObjectKey(_selectedHouse),
                  house: _selectedHouse,
                  permissionLevel: authState.user.permissionLevel,
                ),
              ),
            ),
            ConstrainedBox(
              constraints: BoxConstraints( maxHeight: 300),
              child: UserScoreCard(
                yearScores: _selectedHouse.overallScores,
                semesterScores: _selectedHouse.semesterScores,
                key: ObjectKey(_selectedHouse),
              ),
            ),
            ConstrainedBox(
              constraints: BoxConstraints( maxHeight: 300),
              child: HousePointTypeSubmissionsCard(
                key: ObjectKey(_selectedHouse),
                submissions: _selectedHouse.submissions,
              ),
            )
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

  checkForMessage(BuildContext context, OverviewState state){
    if(state is GrantAwardSuccess){
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.of(context).pop();
      });
      final snackBar = SnackBar(
        backgroundColor: Colors.green,
        content:
        Text('The award was successfully added!'),
      );
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Scaffold.of(context).showSnackBar(snackBar);
        _overviewBloc.add(HandleGrantAwardMessage());
      });
    }
    else if(state is GrantAwardError){
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.of(context).pop();
      });
      final snackBar = SnackBar(
        backgroundColor: Colors.red,
        content:
        Text('There was a problem adding the award. Please refresh and try again.'),
      );
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Scaffold.of(context).showSnackBar(snackBar);
        _overviewBloc.add(HandleGrantAwardMessage());
      });
    }
  }



  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return UserPermissionSet([UserPermissionLevel.PROFESSIONAL_STAFF].toSet());
  }
}