import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/HousePointTypeCount.dart';

class HousePointTypeSubmissionsCard extends StatefulWidget{

  final List<HousePointTypeCount> submissions;

  const HousePointTypeSubmissionsCard({Key key, this.submissions}) : super(key: key);


  @override
  State<StatefulWidget> createState() {
    return _HousePointTypeSubmissionsCardState();
  }

}

class _HousePointTypeSubmissionsCardState extends State<HousePointTypeSubmissionsCard> {
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Container(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                mainAxisSize: MainAxisSize.max,
                children: [
                  Text("House Submission Count",
                    style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold
                    )
                  ),
                  Text("Approved/Submitted",
                    style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold
                    )
                  )
                ],
              ),
            ),
            Flexible(
              fit: FlexFit.loose,
              child: Container(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(8, 0, 8, 4),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Visibility(
                        visible: widget.submissions.length != 0,
                        child: Flexible(
                          fit: FlexFit.loose,
                          child: ListView.builder(
                              shrinkWrap: true,
                              itemCount: widget.submissions.length,
                              itemBuilder: (BuildContext context, index){
                                return Card(
                                  child:Padding(
                                    padding: const EdgeInsets.fromLTRB(8, 4, 8, 4),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.max,
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Flexible(
                                          flex: 5,
                                          child: Text(widget.submissions[index].name)
                                        ),
                                        Flexible(
                                            flex: 1,
                                            child: Text(widget.submissions[index].approved.toString()+"/"+widget.submissions[index].submitted.toString())
                                        )
                                      ],
                                    ),
                                  )
                                );
                              }
                          ),
                        ),
                      ),
                      Visibility(
                        visible: widget.submissions.length == 0,
                        child: Expanded(
                          child: Center(
                            child: Text("There are no point submissions yet."),
                          ),
                        ),
                      )
                    ],
                  ),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

}