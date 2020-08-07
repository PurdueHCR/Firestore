import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Utility_Views/PointLogList.dart';

class RecentSubmissionsCard extends StatefulWidget{
  final List<PointLog> submissions;
  final Function(PointLog log) onPressed;
  const RecentSubmissionsCard({Key key, this.submissions, this.onPressed}) : super(key: key);


  @override
  State<StatefulWidget> createState() {
    return RecentSubmissionsCardState();
  }
}

class RecentSubmissionsCardState extends State<RecentSubmissionsCard>{
  @override
  Widget build(BuildContext context) {
    if(widget.submissions != null && widget.submissions.length > 0){
      return Card(
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Recent Submissions",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold
                  ),
                ),
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                        color: Colors.grey,
                        borderRadius: BorderRadius.all(Radius.circular(4))
                    ),
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(8, 8, 8, 0),
                      child: PointLogList(
                        shrinkWrap: true,
                        searchable: false,
                        pointLogs: widget.submissions,
                        onPressed: (context, log) => widget.onPressed(log),
                      ),
                    ),
                  ),
                )
              ],
            ),
          )
      );
    }
    else{
      return Card(
        child: Center(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text("Once you submit some points, you will view the most recent ones here!",
              textAlign: TextAlign.center,),
            )
        ),
      );
    }
  }
}