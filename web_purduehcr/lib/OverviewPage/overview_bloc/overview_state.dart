import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/Reward.dart';
import 'package:purduehcr_web/Models/UserRank.dart';

abstract class OverviewState extends Equatable{
  const OverviewState();
}

class OverviewInitial extends OverviewState {
  const OverviewInitial();
  @override
  List<Object> get props => [];
}

class OverviewLoading extends OverviewState {
  const OverviewLoading();
  @override
  List<Object> get props => [];
}

class ResidentOverviewLoaded extends OverviewState {
  final UserRank rank;
  final List<PointLog> logs;
  final Reward reward;
  final List<House> houses;

  const ResidentOverviewLoaded({@required this.rank, @required this.logs, @required this.reward, @required this.houses});
  @override
  List<Object> get props => [rank, logs, reward, houses];
}

class OverviewError extends OverviewState {
  final Error error;
  const OverviewError({@required this.error});

  @override
  List<Object> get props => [error];
}