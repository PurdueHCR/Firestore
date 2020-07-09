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

class HandlePointsPageLoaded extends HandlePointsState {

  const HandlePointsPageLoaded({@required List<PointLog> pointLogs}):super(pointLogs: pointLogs);
  @override
  List<Object> get props => [pointLogs];

  @override
  String toString() {
    return "HandlePointsPageLoaded";
  }
}
