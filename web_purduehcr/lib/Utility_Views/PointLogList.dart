import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Utility_Views/SearchBar.dart';

class PointLogList extends StatefulWidget{
  final List<PointLog> pointLogs;
  final Function(BuildContext, PointLog) onPressed;
  final bool searchable;

  const PointLogList({Key key, @required this.pointLogs, @required this.onPressed, this.searchable = true}):
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
        itemCount: visibleLogs.length,
        itemBuilder: (BuildContext context, int index){
          return PointLogListTile(pointLog: visibleLogs[index], onTap: widget.onPressed);
        },
      );
    }

    return Column(
      children: [
        Visibility(
            visible: widget.searchable,
            child: SearchBar(onValueChanged: _onValueChanged)
        ),
        Expanded(
          child: mainContent,
        )
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
    );
  }

}