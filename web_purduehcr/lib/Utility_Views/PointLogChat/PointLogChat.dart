import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:linkable/linkable.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/PointLogMessage.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';
import 'package:purduehcr_web/Utility_Views/PointLogChat/point_log_chat_bloc/point_log_chat.dart';
import 'package:purduehcr_web/Utility_Views/PointLogList.dart';
import 'package:purduehcr_web/Authentication_Bloc/authentication.dart';

class PointLogChat extends StatefulWidget{
  final PointLog pointLog;
  final String house; // included for when Professional staff need to use this

  const PointLogChat({Key key, this.pointLog, this.house}) : super(key:key);

  @override
  State<StatefulWidget> createState() {
    return _PointLogChatState();
  }

}

class _PointLogChatState extends State<PointLogChat>{
  final _scrollController = ScrollController();
  final _textController = TextEditingController();
  PointLogChatBloc _pointLogChatBloc;

  // ignore: close_sinks
  AuthenticationBloc authenticationBloc;
  Authenticated authState;



  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    Config config = ConfigWrapper.of(context);
    _pointLogChatBloc = new PointLogChatBloc(config: config, house: widget.house);

    authenticationBloc = BlocProvider.of<AuthenticationBloc>(context);
    authState = authenticationBloc.state;
    _pointLogChatBloc.add(PointLogChatInitialize(pointLog: widget.pointLog));

  }

  @override
  Widget build(BuildContext context) {
    if(widget.pointLog == null){
      return Center(
        child: Text("Select a Point Submission"),
      );
    }
    else{
      return BlocBuilder(
        bloc: _pointLogChatBloc,
        builder: (BuildContext context, PointLogChatState state) {
          return Column(
            children: [
              buildPointLogCard(),
              buildMessages(state),
              Visibility(
                visible: authState.user.permissionLevel == UserPermissionLevel.RHP,
                child: buildActions(),
              ),
              buildInput(),
            ],
          );
        },
      );
    }
  }

  Widget buildPointLogCard(){
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          children: [
            Flexible(
              fit: FlexFit.loose,
              child: Row(
                children: [
                 Flexible(
                   flex: 5,
                   fit: FlexFit.loose,
                   child: Column(
                     crossAxisAlignment: CrossAxisAlignment.start,
                     children: [
                       Text(widget.pointLog.description,
                         style: Theme.of(context).textTheme.headline5,
                       ),
                       Text(widget.pointLog.residentFirstName + " " +widget.pointLog.residentLastName,
                         style: Theme.of(context).textTheme.bodyText2,
                       ),
                     ],
                   ),
                 ),
                  Flexible(
                    flex: 1,
                    child: Center(
                        child: DateWidget(date: widget.pointLog.dateOccurred, style: Theme.of(context).textTheme.headline5,)
                    ),
                    fit: FlexFit.loose,
                  )
                ],
              ),
            ),
            Flexible(
              fit: FlexFit.loose,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(0, 8, 0, 0),
                child: Text("Point Category",
                style: Theme.of(context).textTheme.headline6,
                ),
              ),
            ),
            Flexible(
              fit: FlexFit.loose,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(8, 0, 0, 0),
                child: Text(widget.pointLog.pointTypeName,
                  style: Theme.of(context).textTheme.bodyText2,
                ),
              ),
            ),
            Flexible(
              fit: FlexFit.loose,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(8, 0, 0, 0),
                child: Text(widget.pointLog.pointTypeDescription,
                  style: Theme.of(context).textTheme.bodyText2,
                ),
              ),
            ),
            Flexible(
              fit: FlexFit.loose,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(0, 4, 0, 0),
                child: Text("Submitted on ${DateFormat.yMd('en_US').format(widget.pointLog.dateSubmitted)} ${DateFormat.jm('en_US').format(widget.pointLog.dateSubmitted)}",
                style: TextStyle(
                    fontSize: 10,
                    color: Theme.of(context).textTheme.bodyText2.color
                  ),
                ),
              ),
            )
          ],
        ),
      )
    );
  }

  Widget buildMessages(PointLogChatState currentState){
    if(currentState is PointLogChatLoaded){
      Timer(
        Duration(milliseconds: 250),
            () => _scrollController.jumpTo(_scrollController.position.maxScrollExtent),
      );
      return Flexible(
        child: ListView.builder(
          itemCount: currentState.messages.length,
          padding: EdgeInsets.all(10.0),
          itemBuilder: (context, index){
            return PointLogMessageTile(
              message: currentState.messages[index],
              isFromCurrentUser: currentState.messages[index].senderFirstName == authState.user.firstName
                  && currentState.messages[index].senderLastName == authState.user.lastName &&
                  currentState.messages[index].senderPermissionLevel == authState.user.permissionLevel.index,
            );
          },
          controller: _scrollController,
          reverse: false,

        ),
      );
    }
    else{
      return Expanded(
        child: LoadingWidget(),
      );
    }
  }

  Widget buildActions(){
    if(widget.pointLog.wasHandled() && widget.pointLog.wasApproved()){
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
                  onPressed: reject,
                ),
              )
          ),
        ],
      );
    }
    else if(widget.pointLog.wasHandled() && !widget.pointLog.wasApproved()){
      return Row(
        mainAxisSize: MainAxisSize.max,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
              child: Padding(
                padding: EdgeInsets.fromLTRB(8, 4, 8, 4),
                child: RaisedButton(
                  child: Text("Approve"),
                  color: Colors.green,
                  onPressed: approve,
                ),
              )
          )
        ],
      );
    }
    else{
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
                  onPressed: reject,
                ),
              )
          ),
          Expanded(
              child: Padding(
                padding: EdgeInsets.fromLTRB(8, 4, 8, 4),
                child: RaisedButton(
                  child: Text("Approve"),
                  color: Colors.green,
                  onPressed: approve,
                ),
              )
          )
        ],
      );
    }
  }

  Widget buildInput() {
    return Container(
      child: Row(
        children: <Widget>[

          // Edit text
          Flexible(
            child: Container(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                child: TextField(
                  onSubmitted: (String value) => postMessage(),
                  controller: _textController,
                  style: TextStyle(color: Colors.black, fontSize: 15.0),
                  //controller: textEditingController,
                  decoration: InputDecoration.collapsed(
                    hintText: 'Type your message...',
                    hintStyle: TextStyle(color: Colors.grey),
                  ),
                ),
              ),
            ),
          ),

          // Button send message
          Material(
            child: Container(
              margin: EdgeInsets.symmetric(horizontal: 8.0),
              child: IconButton(
                icon: Icon(Icons.send),
                onPressed: postMessage,
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
  @override
  void dispose() {
    super.dispose();
    _pointLogChatBloc.close();
  }

  void postMessage(){
    PointLogMessage message = PointLogMessage(
        creationDate: DateTime.now(),
        message: _textController.text,
        messageType: "message",
        senderFirstName: authState.user.firstName,
        senderLastName: authState.user.lastName,
        senderPermissionLevel: authState.user.permissionLevel.index);
    _pointLogChatBloc.add(PostMessage(message: message));
    _textController.text = "";
  }

  void reject() async {
    String reason = await getRejectionMessage();
    if(reason.isNotEmpty){
      PointLogMessage plm = PointLogMessage(
          creationDate: DateTime.now(),
          message: reason,
          messageType: "comment",
          senderFirstName: authState.user.firstName,
          senderLastName: authState.user.lastName,
          senderPermissionLevel: authState.user.permissionLevel.index
      );
      _pointLogChatBloc.add(RejectPointLog(message: plm, user: authState.user));
    }
  }

  void approve(){
    _pointLogChatBloc.add(ApprovePointLog(authState.user));
  }

  Future<String> getRejectionMessage() async {
    String reason = "";
    return await showDialog<String>(
        context: context,
        barrierDismissible: true,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text('Why are you rejecting this point submission?'),
            content: new Row(
              children: <Widget>[
                new Expanded(
                    child: new TextField(
                      autofocus: true,
                      decoration: new InputDecoration(
                          labelText: 'Reason', hintText: 'Not enough detail'),
                      onChanged: (value){
                        reason = value;
                      },
                    ))
              ],
            ),
            actions: <Widget>[
              FlatButton(
                child: Text('Cancel'),
                onPressed: () {
                  Navigator.of(context).pop(reason);
                },
              ),
              FlatButton(
                child: Text('Ok'),
                onPressed: () {
                  Navigator.of(context).pop(reason);
                },
              ),
            ],
          );
        });
  }
}

class PointLogMessageTile extends StatelessWidget{
  final PointLogMessage message;
  final bool isFromCurrentUser;
  const PointLogMessageTile({this.message, this.isFromCurrentUser});

  bool _isLink(String input) {
    final matcher = new RegExp(
        r"(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)");
    return matcher.hasMatch(input);
  }

  @override
  Widget build(BuildContext context) {

    if(isFromCurrentUser){
      return Padding(
        padding: EdgeInsets.fromLTRB(48, 0, 4, 4),
        child: Row(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Flexible(
              child: Padding(
                padding: EdgeInsets.fromLTRB(15.0, 0, 15.0, 4),
                child: Card(
                  color: Colors.lightBlue,
                  child: Padding(
                    padding: EdgeInsets.all(8),
                    child: Linkable(
                      text: message.message,
                      textColor: Colors.white,
                      linkColor: Colors.white,
                    )
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
          mainAxisAlignment: MainAxisAlignment.start,
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
                      child: Linkable(
                        text: message.message,
                        textColor: Colors.black,
                        linkColor: Colors.black,
                      )
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