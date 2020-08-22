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
  final String houseCode;
  const LoggedIn({this.houseCode});

  @override
  List<Object> get props => [];

}

//Created account and joined house and is ready to move on
class CreatedUser extends AuthenticationEvent {
  final User user;
  const CreatedUser(this.user);

  @override
  List<Object> get props => [];

}

class LoggedOut extends AuthenticationEvent {}

class UpdateUser extends AuthenticationEvent{

}