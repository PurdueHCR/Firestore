import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

abstract class ControlEvent extends Equatable {
  const ControlEvent();
}

class ControlInitialize extends ControlEvent {
  const ControlInitialize();
  @override
  List<Object> get props => [];
}

class ControlHandledMessage extends ControlEvent {
  const ControlHandledMessage();
  @override
  List<Object> get props => [];
}

class UpdateSettings extends ControlEvent {
  final bool isCompetitionEnabled;
  final String competitionDisabledMessage;
  final bool isCompetitionVisible;
  final String competitionHiddenMessage;
  final bool isShowingRewards;
  const UpdateSettings({this.isCompetitionEnabled, this.competitionDisabledMessage, this.isCompetitionVisible, this.competitionHiddenMessage, this.isShowingRewards});
  @override
  List<Object> get props => [isCompetitionEnabled, competitionDisabledMessage, isCompetitionVisible, competitionHiddenMessage, isShowingRewards];
}

class RequestBackup extends ControlEvent {
  const RequestBackup();

  @override
  List<Object> get props => [];
}

class EndSemester extends ControlEvent {
  const EndSemester();

  @override
  List<Object> get props => [];
}

class ResetCompetition extends ControlEvent {
  const ResetCompetition();

  @override
  List<Object> get props => [];
}