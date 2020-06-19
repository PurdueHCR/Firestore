import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

abstract class HandlePointEvent extends Equatable {
  const HandlePointEvent();
}

class HandlePointEventInitialize extends HandlePointEvent {
  HandlePointEventInitialize();

  @override
  List<Object> get props => [];

}

class HandlePoint extends HandlePointEvent {
  final String pointlogId;
  final bool isApproved;
  final String rejectionMessage;

  HandlePoint({@required this.pointlogId, @required this.isApproved, this.rejectionMessage, }):
        assert(pointlogId != null), assert(isApproved != null);


  @override
  List<Object> get props => [pointlogId, isApproved, rejectionMessage];

}

class HandlePointDisplayedMessage extends HandlePointEvent {
  HandlePointDisplayedMessage();

  @override
  List<Object> get props => [];
}
