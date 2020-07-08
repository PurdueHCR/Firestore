import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/HandlePointsPage/handle_points_bloc/handle_points.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/PointLogMessage.dart';

class PointLogChat extends StatefulWidget{
  final PointLog pointLog;

  const PointLogChat({Key key, this.pointLog}) : super(key:key);

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _PointLogChatState();
  }

}

class _PointLogChatState extends State<PointLogChat>{
  final _scrollController = ScrollController();
  HandlePointsBloc _handlePointsBloc;

  @override
  void initState() {
    super.initState();
    _handlePointsBloc = BlocProvider.of<HandlePointsBloc>(context);
  }

  @override
  Widget build(BuildContext context) {
    if(widget.pointLog == null){
      return Center(
        child: Text("Select a Point Submission"),
      );
    }
    else{
      Timer(
        Duration(milliseconds: 250),
            () => _scrollController.jumpTo(_scrollController.position.maxScrollExtent),
      );
      return Column(
        children: [
          buildPointLogCard(),
          buildMessages(),
          buildActions(),
          buildInput(),
        ],
      );
    }
  }

  Widget buildPointLogCard(){
    return Card(
      child: Row(
        mainAxisSize: MainAxisSize.max,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(widget.pointLog.residentFirstName + " " +widget.pointLog.residentLastName),
              Text(widget.pointLog.description),
              Text(widget.pointLog.pointTypeName),
              Text(widget.pointLog.pointTypeDescription)
            ],
          ),
        ],
      )
    );
  }

  Widget buildMessages(){
    return Flexible(
      child: ListView.builder(
        itemCount: 10,
        padding: EdgeInsets.all(10.0),
        itemBuilder: (context, index){
          return PointLogMessageTile(
              message: PointLogMessage(DateTime.now(), "Message ${index.toString()}. This is going to be really long to test wrapping around and correct distance to loook super cool. Wow", "message", "Joe", "Bill", 0),
              isFromCurrentUser: (index % 2 == 0),
            );
          },
        controller: _scrollController,
        reverse: false,

      ),
    );
  }

  Widget buildActions(){
    return Row(
      mainAxisSize: MainAxisSize.max,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded(
            child: Padding(
              padding: EdgeInsets.fromLTRB(8, 4, 8, 4),
              child: RaisedButton(
                child: Text("Reject"),
                color: Colors.red,
              ),
            )
        ),
        Expanded(
            child: Padding(
              padding: EdgeInsets.fromLTRB(8, 4, 8, 4),
              child: RaisedButton(
                child: Text("Approve"),
                color: Colors.green,
              ),
            )
        )
      ],
    );
  }

  Widget buildInput() {
    return Container(
      child: Row(
        children: <Widget>[

          // Edit text
          Flexible(
            child: Container(
              child: TextField(
                style: TextStyle(color: Colors.black, fontSize: 15.0),
                //controller: textEditingController,
                decoration: InputDecoration.collapsed(
                  hintText: 'Type your message...',
                  hintStyle: TextStyle(color: Colors.grey),
                ),
//                focusNode: focusNode,
              ),
            ),
          ),

          // Button send message
          Material(
            child: Container(
              margin: EdgeInsets.symmetric(horizontal: 8.0),
              child: IconButton(
                icon: Icon(Icons.send),
//                onPressed: () => onSendMessage(textEditingController.text, 0),
                color: Colors.blue,
              ),
            ),
            color: Colors.white,
          ),
        ],
      ),
      width: double.infinity,
      height: 50.0,
      decoration: BoxDecoration(border: Border(top: BorderSide(color: Colors.grey, width: 0.5)), color: Colors.white),
    );
  }
}

class PointLogMessageTile extends StatelessWidget{
  final PointLogMessage message;
  final bool isFromCurrentUser;
  const PointLogMessageTile({this.message, this.isFromCurrentUser});
  @override
  Widget build(BuildContext context) {
    if(isFromCurrentUser){
      return Padding(
        padding: EdgeInsets.fromLTRB(48, 0, 4, 4),
        child: Row(
          mainAxisSize: MainAxisSize.max,
          children: [
            Flexible(
              child: Padding(
                padding: EdgeInsets.fromLTRB(15.0, 0, 15.0, 4),
                child: Card(
                  color: Colors.lightBlue,
                  child: Padding(
                    padding: EdgeInsets.all(8),
                    child: Text(message.message,textAlign: TextAlign.start),
                  ),
                ),
              ),
            ),
            Column(
              children: [
                Text(message.senderFirstName),
                Text(message.senderLastName)
              ],
            )
          ],
        ),
      );
    }
    else{
      return Padding(
        padding: EdgeInsets.fromLTRB(4, 0, 48, 4),
        child: Row(
          mainAxisSize: MainAxisSize.max,
          children: [
            Column(
              children: [
                Text(message.senderFirstName),
                Text(message.senderLastName)
              ],
            ),
            Flexible(
              child: Padding(
                padding: EdgeInsets.fromLTRB(15.0, 0, 15.0, 4),
                child: Card(
                  color: Colors.black26,
                  child: Padding(
                    padding: EdgeInsets.all(8),
                    child: Text(message.message,textAlign: TextAlign.start),
                  ),
                ),
              ),
            )
          ],
        ),
      );
    }
  }
}