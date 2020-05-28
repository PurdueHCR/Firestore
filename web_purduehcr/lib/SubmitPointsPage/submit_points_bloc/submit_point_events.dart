import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

abstract class SubmitPointEvent extends Equatable {
  const SubmitPointEvent();
}

class SubmitPointInitialize extends SubmitPointEvent {
  SubmitPointInitialize();

  @override
  List<Object> get props => [];

}

class SubmitPoint extends SubmitPointEvent {
  final String description;
  final DateTime dateOccurred;
  final int pointTypeId;

  SubmitPoint({@required this.description, @required this.dateOccurred, @required this.pointTypeId}):
        assert(description != null), assert(dateOccurred != null), assert(pointTypeId != null);


  @override
  List<Object> get props => [description, dateOccurred, pointTypeId];

}

