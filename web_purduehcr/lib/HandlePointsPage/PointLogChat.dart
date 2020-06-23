import 'package:flutter/cupertino.dart';
import 'package:purduehcr_web/Models/PointLog.dart';

class PointLogChat extends StatefulWidget{
  final PointLog pointLog;
  final Function(String message) postMessage;
  final Function(bool approve) handlePointLog;

  const PointLogChat({Key key, this.pointLog, this.postMessage, this.handlePointLog}) : super(key:key);

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _PointLogChatState();
  }

}

class _PointLogChatState extends State<PointLogChat>{
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    throw UnimplementedError();
  }
}