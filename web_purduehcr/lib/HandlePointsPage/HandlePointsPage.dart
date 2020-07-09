import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/Utility_Views/PointLogChat/PointLogChat.dart';
import 'package:purduehcr_web/HandlePointsPage/handle_points_bloc/handle_points.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/SubmitPointsPage/submit_points_bloc/submit_point_bloc.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/PointLogList.dart';

import '../BasePage.dart';
import '../Config.dart';

class HandlePointsPage extends BasePage {
  @override
  State<StatefulWidget> createState() {
    return _HandlePointsPageState(drawerLabel: "Handle Points");
  }
}

class _HandlePointsPageState extends BasePageState<HandlePointsBloc, HandlePointEvent, HandlePointsState>{

  HandlePointsBloc _handlePointsBloc;
  PointLog _selectedPointLog;

  _HandlePointsPageState({@required String drawerLabel}):super(drawerLabel:drawerLabel);

  @override
  void initState() {
    super.initState();
    Config config = ConfigWrapper.of(context);
    _handlePointsBloc = new HandlePointsBloc(config);
    _handlePointsBloc.add(HandlePointEventInitialize());
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, HandlePointsState state}) {
    return Row(
      children: [
        Flexible(
          child: PointLogList(
              pointLogs: _handlePointsBloc.state.pointLogs,
              onPressed: _onPressed
          ),
        ),
        VerticalDivider(),
        Flexible(
          child: BlocProvider<HandlePointsBloc>(
            builder: (BuildContext context) => _handlePointsBloc,
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
  Widget buildMobileBody({BuildContext context, HandlePointsState state}) {
    if(_selectedPointLog == null){
      return PointLogList(
          pointLogs: _handlePointsBloc.state.pointLogs,
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
  Widget buildSmallDesktopBody({BuildContext context, HandlePointsState state}) {
    if(_selectedPointLog == null){
      return PointLogList(
          pointLogs: _handlePointsBloc.state.pointLogs,
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
  HandlePointsBloc getBloc() {
    return _handlePointsBloc;
  }

  @override
  bool isLoadingState(HandlePointsState currentState) {
    return currentState is HandlePointsPageLoading;
  }

  @override
  Widget buildLeadingButton(DisplayType displayType){
    if(_selectedPointLog == null){
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
}