import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/HandlePointsPage/PointLogChat.dart';
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
                pointLog: _selectedPointLog
            )
          )
        )
      ],
    );
  }

  @override
  Widget buildMobileBody({BuildContext context, HandlePointsState state}) {
    return PointLogList(
        pointLogs: _handlePointsBloc.state.pointLogs,
        onPressed: _onPressed
    );
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, HandlePointsState state}) {
    return PointLogList(
        pointLogs: _handlePointsBloc.state.pointLogs,
        onPressed: _onPressed
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

  _onPressed(BuildContext context, PointLog pointLog) {
    if (displayTypeOf(context) == DisplayType.desktop_large) {
      setState(() {
        _selectedPointLog = pointLog;
      });
    }
    else {
      showDialog(
          context: context,
          builder: (BuildContext context) {
            return BlocProvider<HandlePointsBloc>(
              builder: (BuildContext context) => _handlePointsBloc,
              child: SimpleDialog(
                title: Text("Chat"),
                children: [
                  PointLogChat(
                      pointLog: pointLog
                  )
                ],
              ),
            );
          }
      );
    }
  }
}