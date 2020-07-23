import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Utility_Views/PointLogList.dart';

class RecentSubmissionsCard extends StatefulWidget{
  final List<PointLog> submissions;

  const RecentSubmissionsCard({Key key, this.submissions}) : super(key: key);


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
                Flexible(
                  flex: 1,
                  child: Text("Recent Submissions",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold
                    ),
                  ),
                ),
                Flexible(
                  flex: 8,
                  child: Container(
                    decoration: BoxDecoration(
//                        border: Border.all(
//                          color: Colors.black,
//                          width: 2
//                        ),
                        color: Colors.grey,
                        borderRadius: BorderRadius.all(Radius.circular(4))
                    ),
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(8, 8, 8, 0),
                      child: PointLogList(
                        searchable: false,
                        pointLogs: widget.submissions,
                        onPressed: (context, log) => print("Tap"),
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
        child: Text("You haven't submitted any points yet!"),
      );
    }
  }
}