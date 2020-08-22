import 'package:equatable/equatable.dart';
import 'package:flutter/cupertino.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';

abstract class FindUsersState extends Equatable{
  final List<User> users;
  const FindUsersState({this.users});
}


class FindUsersPageLoading extends FindUsersState {
  const FindUsersPageLoading();
  @override
  List<Object> get props => [];
}

class FindUsersPageLoaded extends FindUsersState {
  const FindUsersPageLoaded();
  @override
  List<Object> get props => [];
}

class FindUsersError extends FindUsersState {
  const FindUsersError();
  @override
  List<Object> get props => [];
}

class FindUsersLoading extends FindUsersState {
  const FindUsersLoading();
  @override
  List<Object> get props => [];
}

class FindUsersLoaded extends FindUsersState {
  const FindUsersLoaded(List<User> users): super(users:users);
  @override
  List<Object> get props => [UniqueKey()];
}

class UpdateUserError extends FindUsersState {
  const UpdateUserError(List<User> users): super(users:users);
  @override
  List<Object> get props => [];
}