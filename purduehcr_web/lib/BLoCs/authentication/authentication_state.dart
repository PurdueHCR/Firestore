import 'package:equatable/equatable.dart';
import 'package:purduehcr_web/Models/User.dart';

abstract class AuthenticationState extends Equatable {
  @override
  List<Object> get props => [];
}

class AuthenticationUninitialized extends AuthenticationState {}

class AuthenticationAuthenticated extends AuthenticationState {
  final User user;
  final String token;
  AuthenticationAuthenticated(this.token, this.user);
}

class AuthenticationUnauthenticated extends AuthenticationState {}

class AuthenticationLoading extends AuthenticationState {}