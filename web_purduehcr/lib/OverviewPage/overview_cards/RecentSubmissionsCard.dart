import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/PointLog.dart';

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
    return Card(
      child: Text("Recent Submissions"),
    );
  }
}