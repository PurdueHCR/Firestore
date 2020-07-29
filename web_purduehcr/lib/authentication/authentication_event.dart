import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/User.dart';

abstract class AuthenticationEvent extends Equatable {
  const AuthenticationEvent();

  @override
  List<Object> get props => [];
}

class AppStarted extends AuthenticationEvent {

  const AppStarted();

  @override
  List<Object> get props => [];
}

class LoggedIn extends AuthenticationEvent {

  const LoggedIn();

  @override
  List<Object> get props => [];

}

class CreatedAccount extends AuthenticationEvent {
  final User user;
  const CreatedAccount(this.user);

  @override
  List<Object> get props => [];

}

class LoggedOut extends AuthenticationEvent {}