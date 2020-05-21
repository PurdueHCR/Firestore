import 'package:equatable/equatable.dart';
import 'package:purduehcr_web/Models/User.dart';

abstract class AuthenticationState extends Equatable {
  @override
  List<Object> get props => [];
}

class AuthUninitialized extends AuthenticationState {}

class Authenticated extends AuthenticationState {
  final User user;
  Authenticated(this.user);
}

class Unauthenticated extends AuthenticationState {}

class AuthLoading extends AuthenticationState {}