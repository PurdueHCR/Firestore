import 'package:equatable/equatable.dart';

abstract class HandlePointEvent extends Equatable {
  const HandlePointEvent();
}

class HandlePointEventInitialize extends HandlePointEvent {
  HandlePointEventInitialize();

  @override
  List<Object> get props => [];

}
