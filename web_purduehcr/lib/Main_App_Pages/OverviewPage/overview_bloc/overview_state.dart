import 'package:equatable/equatable.dart';
import 'package:flutter/widgets.dart';
import 'package:meta/meta.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/HouseCode.dart';
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
  final House myHouse;
  final Key key;

  const ResidentOverviewLoaded({@required this.rank, @required this.logs, @required this.reward, @required this.houses, @required this.myHouse, this.key});
  @override
  List<Object> get props => [rank, logs, reward, houses, key];
}

class RHPOverviewLoaded extends OverviewState {
  final UserRank rank;
  final List<PointLog> logs;
  final Reward reward;
  final List<House> houses;
  final House myHouse;
  final List<HouseCode> houseCodes;
  final Key key;

  const RHPOverviewLoaded({@required this.rank, @required this.logs, @required this.reward, @required this.houses, @required this.myHouse, @required this.houseCodes, this.key});
  @override
  List<Object> get props => [rank, logs, reward, houses, key, houseCodes];
}

class ProfessionalStaffLoaded extends OverviewState {
  final List<House> houses;

  const ProfessionalStaffLoaded({@required this.houses});
  @override
  List<Object> get props => [UniqueKey()];
}

class FHPOverviewLoaded extends OverviewState {
  final Reward reward;
  final List<House> houses;
  final House myHouse;
  final Key key;

  const FHPOverviewLoaded({@required this.reward, @required this.houses, @required this.key, @required this.myHouse});

  @override
  List<Object> get props => [reward, houses, key];
}

class OverviewError extends OverviewState {
  final Error error;
  const OverviewError({@required this.error});

  @override
  List<Object> get props => [error];
}

class GrantAwardSuccess extends ProfessionalStaffLoaded {
  const GrantAwardSuccess(List<House> houses): super(houses:houses);
  @override
  List<Object> get props => [houses];
}

class GrantAwardError extends ProfessionalStaffLoaded {
  const GrantAwardError(List<House> houses): super(houses:houses);
  @override
  List<Object> get props => [houses];
}
class UpdateHouseError extends ProfessionalStaffLoaded {
  UpdateHouseError(List<House> houses): super(houses:houses);

  @override
  List<Object> get props => [];
}