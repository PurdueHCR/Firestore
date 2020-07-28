import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/UserScore.dart';

class UserScoreCard extends StatefulWidget{

  final List<UserScore> yearScores;
  final List<UserScore> semesterScores;

  const UserScoreCard({Key key, this.yearScores, this.semesterScores}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _UserScoreCardState();
  }

}

class _UserScoreCardState extends State<UserScoreCard>{

  List<UserScore> _selectedList;

  @override
  void initState() {
    super.initState();
    if(_selectedList == null){
      _selectedList = widget.yearScores;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Container(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Text("House Leader board",
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold
                  )
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  RaisedButton(
                    child: Text("Overall"),
                    onPressed: (){
                      setState(() {
                        _selectedList = widget.yearScores;
                      });
                    },
                  ),
                  RaisedButton(
                    child: Text("Semester"),
                    onPressed: (){
                      setState(() {
                        _selectedList = widget.semesterScores;
                      });
                    },
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
                        visible: _selectedList.length != 0,
                        child: Flexible(
                          fit: FlexFit.loose,
                          child: ListView.builder(
                            shrinkWrap: true,
                            itemCount: _selectedList.length,
                              itemBuilder: (BuildContext context, index){
                              return Card(
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(vertical: 4,horizontal: 8),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Flexible(
                                        flex: 5,
                                        child: Text((index+1).toString()+". " +_selectedList[index].firstName +" "+ _selectedList[index].lastName),
                                      ),
                                      Flexible(
                                        flex: 1,
                                        child: Text((_selectedList == widget.yearScores)?_selectedList[index].totalPoints.toString():_selectedList[index].semesterPoints.toString() ),
                                      )
                                    ],
                                  ),
                                ),
                              );
                            }
                          ),
                        ),
                      ),
                      Visibility(
                        visible: _selectedList.length == 0,
                        child: Expanded(
                          child: Center(
                            child: Text("There are no users in this house yet."),
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