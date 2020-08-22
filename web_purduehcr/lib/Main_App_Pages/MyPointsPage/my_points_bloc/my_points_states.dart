import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';
import 'package:purduehcr_web/Models/PointLog.dart';

abstract class MyPointsState extends Equatable {
  final List<PointLog> pointLogs;
  const MyPointsState({this.pointLogs});
}

class MyPointsPageLoading extends MyPointsState {
  const MyPointsPageLoading();
  @override
  List<Object> get props => [];

  @override
  String toString() {
    return "MyPointsPageLoading";
  }
}

class MyPointsPageLoaded extends MyPointsState {

  const MyPointsPageLoaded({@required List<PointLog> pointLogs}):super(pointLogs: pointLogs);
  @override
  List<Object> get props => [pointLogs];

  @override
  String toString() {
    return "MyPointsPageLoaded";
  }
}
