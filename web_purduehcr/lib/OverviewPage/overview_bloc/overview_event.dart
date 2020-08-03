import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';
import 'package:purduehcr_web/Models/House.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';

abstract class OverviewEvent extends Equatable {
  const OverviewEvent();
}

class OverviewLaunchedEvent extends OverviewEvent {
  final UserPermissionLevel permissionLevel;
  OverviewLaunchedEvent({@required this.permissionLevel});

  @override
  List<Object> get props => [permissionLevel];
}

class ReloadOverview extends OverviewEvent {
  final UserPermissionLevel permissionLevel;
  ReloadOverview({@required this.permissionLevel});

  @override
  List<Object> get props => [permissionLevel];
}

class GrantAward extends OverviewEvent {
  final String description;
  final House house;
  final double pointsPerResident;

  GrantAward(this.description, this.house, this.pointsPerResident);

  @override
  List<Object> get props => [description, house, pointsPerResident];

}

class HandleGrantAwardMessage extends OverviewEvent {
  HandleGrantAwardMessage();

  @override
  List<Object> get props => [];
}

class UpdateHouse extends OverviewEvent {
  final House house;
  final String description;
  final int numberOfResidents;
  const UpdateHouse(this.house, {this.description, this.numberOfResidents});
  @override
  List<Object> get props => [house, description, numberOfResidents];
}
