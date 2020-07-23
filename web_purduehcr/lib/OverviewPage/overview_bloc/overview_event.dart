import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';
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