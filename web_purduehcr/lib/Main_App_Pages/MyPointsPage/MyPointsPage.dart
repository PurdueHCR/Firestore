import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Utility_Views/BasePage.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Main_App_Pages/MyPointsPage/my_points_bloc/my_points.dart';
import 'package:purduehcr_web/Utility_Views/PointLogChat/PointLogChat.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/PointLogList.dart';

import 'my_points_bloc/my_points_bloc.dart';

class MyPointsPage extends BasePage {
  @override
  State<StatefulWidget> createState() {
    return _MyPointsPageState( "My Points");
  }
}

class _MyPointsPageState extends BasePageState<MyPointsBloc, MyPointsEvent, MyPointsState>{

  MyPointsBloc _myPointsBloc;
  PointLog _selectedPointLog;

  _MyPointsPageState(String drawerLabel) : super(drawerLabel);


  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if(_myPointsBloc == null){
      Config config = ConfigWrapper.of(context);
      _myPointsBloc = new MyPointsBloc(config);
      _myPointsBloc.add(MyPointsPageInitialize());
    }
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, MyPointsState state}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.max,
      children: [
        Flexible(
          child: Container(
            height: MediaQuery.of(context).size.height,
            child: PointLogList(
                pointLogs: _myPointsBloc.state.pointLogs,
                onPressed: _onPressed
            ),
          ),
        ),
        VerticalDivider(),
        Flexible(
          child: BlocProvider<MyPointsBloc>(
            create: (BuildContext context) => _myPointsBloc,
            child: PointLogChat(
              key: ObjectKey(_selectedPointLog),
                pointLog: _selectedPointLog
            )
          )
        )
      ],
    );
  }

  @override
  Widget buildMobileBody({BuildContext context, MyPointsState state}) {
    if(_selectedPointLog == null){
      return PointLogList(
          pointLogs: _myPointsBloc.state.pointLogs,
          onPressed: _onPressed
      );
    }
    else{
      return PointLogChat(
          key: ObjectKey(_selectedPointLog),
          pointLog: _selectedPointLog
      );
    }
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, MyPointsState state}) {
    if(_selectedPointLog == null){
      return PointLogList(
          pointLogs: _myPointsBloc.state.pointLogs,
          onPressed: _onPressed
      );
    }
    else{
      return PointLogChat(
          key: ObjectKey(_selectedPointLog),
          pointLog: _selectedPointLog
      );
    }
  }

  @override
  MyPointsBloc getBloc() {
    return _myPointsBloc;
  }

  @override
  bool isLoadingState(MyPointsState currentState) {
    return currentState is MyPointsPageLoading;
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

  _onPressed(BuildContext context, PointLog pointLog) {
    setState(() {
      _selectedPointLog = pointLog;
    });
  }

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return CompetitionParticipantsSet();
  }
}