import 'package:equatable/equatable.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';

abstract class FindUsersEvent extends Equatable {
  const FindUsersEvent();
}

class HandleMessage extends FindUsersEvent {
  const HandleMessage();
  @override
  List<Object> get props => [];
}

class FindUsers extends FindUsersEvent {
  final String term;
  final String previousName;
  const FindUsers(this.term, {this.previousName} );
  @override
  List<Object> get props => [];
}

class UpdateUser extends FindUsersEvent {
  final User user;
  final String first;
  final String last;
  final String house;
  final String floorId;
  final UserPermissionLevel permissionLevel;
  final bool enabled;
  const UpdateUser(this.user, {this.first, this.last, this.house, this.floorId, this.permissionLevel, this.enabled});
  @override
  List<Object> get props => [user,first,last,house,floorId,permissionLevel,enabled];
}