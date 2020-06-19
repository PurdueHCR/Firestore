import 'package:flutter/cupertino.dart';
import 'package:purduehcr_web/ConfigWrapper.dart';
import 'package:purduehcr_web/HandlePointsPage/handle_points_bloc/handle_points.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
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
    return PointLogList(
        pointLogs: _handlePointsBloc.state.pointLogs,
        onPressed: _onPressed
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

  _onPressed(BuildContext context, PointLog pointLog){
//      if(displayTypeOf(context) == DisplayType.desktop_large){
//        setState(() {
//          _selectedPointType = pointType;
//        });
//      }
//      else{
//        showDialog(
//            context: context,
//            builder: (BuildContext context){
//              return SimpleDialog(
//                title: Text("Submission Form"),
//                children: [
//                  PointSubmissionForm(
//                    key: new ObjectKey(_selectedPointType),
//                    pointType: pointType,
//                    onSubmit: _onSubmit,
//                  )
//                ],
//              );
//            }
//        );

  }

}