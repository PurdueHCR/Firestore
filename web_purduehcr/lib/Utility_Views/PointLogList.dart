import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:intl/intl.dart';
import 'package:purduehcr_web/Utility_Views/SearchBar.dart';

class PointLogList extends StatefulWidget{
  final List<PointLog> pointLogs;
  final Function(BuildContext, PointLog) onPressed;
  final bool searchable;
  final bool showLoadMoreButton;
  final Function loadMore;
  final bool shrinkWrap;

  const PointLogList({Key key, @required this.pointLogs, @required this.onPressed, this.searchable = true, this.showLoadMoreButton = false, this.loadMore, this.shrinkWrap = false}):
        assert(pointLogs != null), assert(onPressed != null), super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _PointLogListState();
  }

}

class _PointLogListState extends State<PointLogList>{
  List<PointLog> visibleLogs;

  @override
  void initState() {
    super.initState();
    visibleLogs = widget.pointLogs;
  }
  @override
  Widget build(BuildContext context) {
    Widget mainContent;
    if(visibleLogs.isEmpty){
      mainContent = Center(
        child: Text("No Point Submissions Found"),
      );
    }
    else{
      mainContent = ListView.builder(
        shrinkWrap: widget.shrinkWrap,
        itemCount: (this.widget.showLoadMoreButton)? visibleLogs.length + 1 : visibleLogs.length,
        itemBuilder: (BuildContext context, int index){
          if(index == visibleLogs.length){
            return OutlineButton(
              child: Text("Load More"),
              onPressed: this.widget.loadMore,
            );
          }
          else{
            return Card(
              child: PointLogListTile(pointLog: visibleLogs[index], onTap: widget.onPressed),
            );
          }
        },
      );
    }

    return Column(
      mainAxisSize: MainAxisSize.max,
      children: [
        Visibility(
            visible: widget.searchable,
            child: SearchBar(onValueChanged: _onValueChanged)
        ),
        Expanded(child: mainContent)
      ],
    );
  }
  _onValueChanged(String value){
    setState(() {
      if(value.isEmpty){
        visibleLogs = widget.pointLogs;
      }
      else{
        visibleLogs = new List<PointLog>();
        for(PointLog log in widget.pointLogs){
          if(log.residentFirstName.contains(value) || log.residentLastName.contains(value) || log.description.contains(value)){
            visibleLogs.add(log);
          }
        }
      }
    });

  }
}


class PointLogListTile extends StatelessWidget{
  final PointLog pointLog;
  final Function(BuildContext context, PointLog pointLog) onTap;

  const PointLogListTile({Key key, @required this.pointLog, @required this.onTap}):
        assert(pointLog != null), assert(onTap != null), super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: () => onTap(context, pointLog),
      title: Text(pointLog.residentFirstName),
      subtitle: Text(pointLog.description),
      leading: PointLogStatusWidget(pointLog: pointLog),
      trailing: DateWidget(date: pointLog.dateOccurred),
    );
  }

}

class DateWidget extends StatelessWidget {
  final DateTime date;
  const DateWidget({@required this.date});

  @override
  Widget build(BuildContext context) {
    var monthFormatter = new DateFormat('MMM');
    var dayFormatter = new DateFormat("d");
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(monthFormatter.format(date)),
        Text(dayFormatter.format(date)),
      ],
    );
  }
}

class PointLogStatusWidget extends StatelessWidget {
  final PointLog pointLog;

  const PointLogStatusWidget({ @required this.pointLog}):
        assert(pointLog != null);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        (!pointLog.wasHandled()) ? Icon(Icons.thumbs_up_down, color: Colors.yellow) :
        pointLog.wasApproved() ? Icon(Icons.thumb_up, color: Colors.green,) : Icon(Icons.thumb_down, color: Colors.red)
      ],
    );
  }
}