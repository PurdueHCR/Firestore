import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';

import 'PointLogChat/PointLogChat.dart';
import 'PointLogList.dart';

class LogListAndChat extends StatelessWidget{

  final List<PointLog> logs;
  final Function(BuildContext, PointLog) onPressed;
  final PointLog selectedPointLog;
  final bool searchable;
  final bool showLoadMore;
  final Function loadMore;

  const LogListAndChat({Key key, this.logs, this.onPressed, this.selectedPointLog, this.searchable = true, this.showLoadMore = false, this.loadMore}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if(displayTypeOf(context) == DisplayType.desktop_large){
      return Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.max,
        children: [
          Flexible(
            child: Container(
              height: MediaQuery.of(context).size.height,
              child: PointLogList(
                  pointLogs: logs,
                  onPressed: onPressed,
                  searchable: searchable,
                  showLoadMoreButton: showLoadMore,
                  loadMore: loadMore,
              ),
            ),
          ),
          VerticalDivider(),
          Flexible(
              child: PointLogChat(
                  key: ObjectKey(selectedPointLog),
                  pointLog: selectedPointLog
              )
          )
        ],
      );
    }
    else{
      if(selectedPointLog == null){
        return PointLogList(
            pointLogs: logs,
            onPressed: onPressed,
            searchable: searchable,
            showLoadMoreButton: showLoadMore,
            loadMore: loadMore,
        );
      }
      else{
        return PointLogChat(
            key: ObjectKey(selectedPointLog),
            pointLog: selectedPointLog
        );
      }
    }
  }
}

