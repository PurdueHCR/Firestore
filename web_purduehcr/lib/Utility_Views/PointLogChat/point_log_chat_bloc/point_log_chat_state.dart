import 'package:equatable/equatable.dart';
import 'package:flutter/cupertino.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/PointLogMessage.dart';

abstract class PointLogChatState extends Equatable{
  final PointLog pointLog;
  const PointLogChatState({this.pointLog});
}


class PointLogChatLoading extends PointLogChatState {
  const PointLogChatLoading();
  @override
  List<Object> get props => [];
}

class PointLogChatLoaded extends PointLogChatState {
  final List<PointLogMessage> messages;
  const PointLogChatLoaded({this.messages, PointLog pointLog}):super(pointLog:pointLog);
  @override
  List<Object> get props => [UniqueKey()];
}