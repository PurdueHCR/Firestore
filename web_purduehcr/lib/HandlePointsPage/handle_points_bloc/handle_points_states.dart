import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';
import 'package:purduehcr_web/Models/PointLog.dart';

abstract class HandlePointsState extends Equatable {
  final List<PointLog> pointLogs;
  const HandlePointsState({this.pointLogs});
}

class HandlePointsPageLoading extends HandlePointsState {
  const HandlePointsPageLoading();
  @override
  List<Object> get props => [];

  @override
  String toString() {
    return "HandlePointsPageLoading";
  }
}

class HandlePointProcessing extends HandlePointsState {
  const HandlePointProcessing({@required List<PointLog> pointLogs}):super(pointLogs: pointLogs);
  @override
  List<Object> get props => [];

  @override
  String toString() {
    return "HandlePointProcessing";
  }
}

class ReadyToHandlePoint extends HandlePointsState {
  const ReadyToHandlePoint({@required List<PointLog> pointLogs}):super(pointLogs: pointLogs);
  @override
  List<Object> get props => [pointLogs];

  @override
  String toString() {
    return "ReadyForSubmission";
  }
}

class HandleSuccess extends HandlePointsState {
  final bool shouldDismissDialog;
  const HandleSuccess({@required List<PointLog> pointLogs, this.shouldDismissDialog = false}):super(pointLogs: pointLogs);

  @override
  List<Object> get props => [];

  @override
  String toString() {
    return "SubmissionSuccess";
  }
}

class SubmissionError extends HandlePointsState {
  final String message;
  final bool shouldDismissDialog;
  const SubmissionError({@required List<PointLog> pointLogs, @required this.message, this.shouldDismissDialog = false}):super(pointLogs: pointLogs);

  @override
  List<Object> get props => [message];

  @override
  String toString() {
    return "SubmissionError";
  }
}