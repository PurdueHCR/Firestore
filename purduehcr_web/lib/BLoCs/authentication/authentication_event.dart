import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/User.dart';

abstract class AuthenticationEvent extends Equatable {
  const AuthenticationEvent();

  @override
  List<Object> get props => [];
}

class AppStarted extends AuthenticationEvent {
  final BuildContext context;
  const AppStarted(this.context);

  @override
  List<Object> get props => [context];
}

class LoggedIn extends AuthenticationEvent {
  final User user;

  const LoggedIn({@required this.user});

  @override
  List<Object> get props => [user];

  @override
  String toString() => 'LoggedIn { user: $user }';
}

class LoggedOut extends AuthenticationEvent {}