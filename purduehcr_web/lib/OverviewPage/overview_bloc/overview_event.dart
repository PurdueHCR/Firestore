import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';

abstract class OverviewEvent extends Equatable {
  const OverviewEvent();
}

class OverviewLaunchedEvent extends OverviewEvent {
  final UserPermissionLevel permissionLevel;
  final String token;
  OverviewLaunchedEvent({@required this.permissionLevel, @required this.token});

  @override
  List<Object> get props => [permissionLevel, token];

}