import 'package:equatable/equatable.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/PointLogMessage.dart';

abstract class PointLogChatEvent extends Equatable {
  const PointLogChatEvent();
}

///Load messages
class PointLogChatInitialize extends PointLogChatEvent {
  final PointLog pointLog;
  const PointLogChatInitialize({this.pointLog});
  @override
  List<Object> get props => [pointLog];
}


///Load messages
class PostMessage extends PointLogChatEvent {
  final PointLogMessage message;
  const PostMessage({this.message});
  @override
  List<Object> get props => [message];
}

///Approve Point Log
class ApprovePointLog extends PointLogChatEvent {

  const ApprovePointLog();
  @override
  List<Object> get props => [];
}

///Reject Point Log
class RejectPointLog extends PointLogChatEvent {
  final PointLogMessage message;
  const RejectPointLog({this.message});
  @override
  List<Object> get props => [message];
}

