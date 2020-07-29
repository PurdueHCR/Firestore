import 'package:equatable/equatable.dart';
import 'package:purduehcr_web/Models/SystemPreferences.dart';
import 'package:purduehcr_web/Models/User.dart';

abstract class AuthenticationState extends Equatable {
  final SystemPreference preferences;
  const AuthenticationState({this.preferences});
  @override
  List<Object> get props => [];
}

class AuthUninitialized extends AuthenticationState {
  const AuthUninitialized({SystemPreference preferences}): super(preferences:preferences);
}

class Authenticated extends AuthenticationState {
  final User user;
  Authenticated(this.user,{SystemPreference preferences}): super(preferences:preferences);
}

class Unauthenticated extends AuthenticationState {
  const Unauthenticated({SystemPreference preferences}): super(preferences:preferences);
}

class ConnectionErrorState extends AuthenticationState {
  const ConnectionErrorState({SystemPreference preferences}): super(preferences:preferences);
}

class AuthenticatedButNoUser extends AuthenticationState{
  final String houseCode;
  const AuthenticatedButNoUser({SystemPreference preferences, this.houseCode}): super(preferences:preferences);
}

class AuthLoading extends AuthenticationState {
  const AuthLoading({SystemPreference preferences}): super(preferences:preferences);
}