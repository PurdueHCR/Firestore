import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';
import 'package:purduehcr_web/Models/PointType.dart';

abstract class SubmitPointState extends Equatable{
  const SubmitPointState();
}

class SubmitPointPageLoading extends SubmitPointState {
  const SubmitPointPageLoading();
  @override
  List<Object> get props => [];
}

class SubmissionProcessing extends SubmitPointState {
  const SubmissionProcessing();
  @override
  List<Object> get props => [];
}

class ReadyForSubmission extends SubmitPointState {
  final List<PointType> pointTypes;
  final String successMessage;

  const ReadyForSubmission({@required this.pointTypes, this.successMessage});
  @override
  List<Object> get props => [pointTypes, successMessage];
}

class SubmitPointError extends SubmitPointState {
  final Error error;
  const SubmitPointError({@required this.error});

  @override
  List<Object> get props => [error];
}