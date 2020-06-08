import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';
import 'package:purduehcr_web/Models/PointType.dart';

abstract class SubmitPointState extends Equatable{
  final List<PointType> pointTypes;
  const SubmitPointState({this.pointTypes});
}

class SubmitPointPageLoading extends SubmitPointState {
  const SubmitPointPageLoading();
  @override
  List<Object> get props => [];

  @override
  String toString() {
    return "SubmitPointPageLoading";
  }
}

class SubmissionProcessing extends SubmitPointState {
  const SubmissionProcessing({@required List<PointType> pointTypes}):super(pointTypes: pointTypes);
  @override
  List<Object> get props => [];

  @override
  String toString() {
    return "SubmissionProcessing";
  }
}

class ReadyForSubmission extends SubmitPointState {
  const ReadyForSubmission({@required List<PointType> pointTypes}):super(pointTypes: pointTypes);
  @override
  List<Object> get props => [pointTypes];

  @override
  String toString() {
    return "ReadyForSubmission";
  }
}

class SubmissionSuccess extends SubmitPointState {
  final bool shouldDismissDialog;
  const SubmissionSuccess({@required List<PointType> pointTypes, this.shouldDismissDialog = false}):super(pointTypes: pointTypes);

  @override
  List<Object> get props => [];

  @override
  String toString() {
    return "SubmissionSuccess";
  }
}

class SubmissionError extends SubmitPointState {
  final String message;
  final bool shouldDismissDialog;
  const SubmissionError({@required List<PointType> pointTypes, @required this.message, this.shouldDismissDialog = false}):super(pointTypes: pointTypes);

  @override
  List<Object> get props => [message];

  @override
  String toString() {
    return "SubmissionError";
  }
}