import 'package:flutter/material.dart';
import 'package:purduehcr_web/Utility_Views/BasePage.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Utility_Views/LogListAndChat.dart';
import 'package:purduehcr_web/Main_App_Pages/HandlePointsPage/handle_points_bloc/handle_points.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/TopBanner.dart';


class HandlePointsPage extends BasePage {
  @override
  State<StatefulWidget> createState() {
    return _HandlePointsPageState("Handle Points");
  }
}

class _HandlePointsPageState extends BasePageState<HandlePointsBloc, HandlePointEvent, HandlePointsState>{

  HandlePointsBloc _handlePointsBloc;
  PointLog _selectedPointLog;

  _HandlePointsPageState(String drawerLabel) : super(drawerLabel);



  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if(_handlePointsBloc == null){
      Config config = ConfigWrapper.of(context);
      _handlePointsBloc = new HandlePointsBloc(config);
      _handlePointsBloc.add(HandlePointEventInitialize());
    }
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, HandlePointsState state}) {
    if(state is HandlePointsPageLoaded){
      return LogListAndChat(logs: state.pointLogs, onPressed: _onPressed, selectedPointLog: _selectedPointLog,);
    }
    else{
      return buildErrorState();
    }
  }

  @override
  Widget buildMobileBody({BuildContext context, HandlePointsState state}) {
    if(state is HandlePointsPageLoaded){
      return LogListAndChat(logs: state.pointLogs, onPressed: _onPressed, selectedPointLog: _selectedPointLog,);
    }
    else{
      return buildErrorState();
    }
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, HandlePointsState state}) {
    if(state is HandlePointsPageLoaded){
      return LogListAndChat(logs: state.pointLogs, onPressed: _onPressed, selectedPointLog: _selectedPointLog,);
    }
    else{
      return buildErrorState();
    }
  }

  Widget buildErrorState(){
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Text("There was an error loading the point submissions. Please Try again"),
      ),
    );
  }

  @override
  HandlePointsBloc getBloc() {
    return _handlePointsBloc;
  }

  @override
  bool isLoadingState(HandlePointsState currentState) {
    return currentState is HandlePointsPageLoading;
  }

  @override
  Widget buildLeadingButton(DisplayType displayType){
    if(_selectedPointLog == null || displayType == DisplayType.desktop_large){
      return null;
    }
    else{
      return IconButton(icon: Icon(Icons.arrow_back),
      onPressed: (){
        setState(() {
          _selectedPointLog = null;
        });
      },);
    }
  }

  @override
  TopBanner getTopBanner() {
    if(!authState.preferences.isCompetitionEnabled){
      return TopBanner(
        color: Colors.yellow,
        message: "Handling Point Submissions Is Prevented When the House Competition Is Not Active",
      );
    }
    else{
      return null;
    }
  }


  _onPressed(BuildContext context, PointLog pointLog) {
    setState(() {
      _selectedPointLog = pointLog;
    });
  }

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return UserPermissionSet([UserPermissionLevel.RHP].toSet());
  }
}