import 'package:equatable/equatable.dart';

abstract class MyPointsEvent extends Equatable {
  const MyPointsEvent();
}

class MyPointsPageInitialize extends MyPointsEvent {
  MyPointsPageInitialize();

  @override
  List<Object> get props => [];

}
