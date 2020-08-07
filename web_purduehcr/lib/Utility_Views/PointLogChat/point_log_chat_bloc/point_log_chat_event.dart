import 'package:equatable/equatable.dart';
import 'package:flutter/cupertino.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/PointLogMessage.dart';
import 'package:purduehcr_web/Models/User.dart';

abstract class PointLogChatEvent extends Equatable {
  const PointLogChatEvent();
}

///Load messages
class PointLogChatInitialize extends PointLogChatEvent {
  final PointLog pointLog;
  const PointLogChatInitialize({this.pointLog});
  @override
  List<Object> get props => [UniqueKey()];
}


///Load messages
class PostMessage extends PointLogChatEvent {
  final PointLogMessage message;
  const PostMessage({this.message});
  @override
  List<Object> get props => [UniqueKey()];
}

///Approve Point Log
class ApprovePointLog extends PointLogChatEvent {
  final User user;
  ///User who is approving the point
  const ApprovePointLog(this.user);
  @override
  List<Object> get props => [UniqueKey()];
}

///Reject Point Log
class RejectPointLog extends PointLogChatEvent {
  final PointLogMessage message;
  final User user;
  ///message and user who is approving the point
  const RejectPointLog({this.message, this.user});
  @override
  List<Object> get props => [UniqueKey()];
}

