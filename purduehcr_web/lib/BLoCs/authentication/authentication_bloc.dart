import 'dart:async';

import 'package:flutter/material.dart';
import 'package:meta/meta.dart';
import 'package:bloc/bloc.dart';
import 'package:purduehcr_web/User_Login_Creation/user_login_creation_bloc/ulc_repository.dart';
import 'authentication.dart';


class AuthenticationBloc
    extends Bloc<AuthenticationEvent, AuthenticationState> {
  final UserRepository userRepository;

  AuthenticationBloc({@required this.userRepository})
      : assert(userRepository != null);

  @override
  AuthenticationState get initialState => AuthenticationUninitialized();

  @override
  Stream<AuthenticationState> mapEventToState(
      AuthenticationEvent event,
      ) async* {
    if (event is AppStarted) {
      final bool hasToken = await userRepository.hasToken();

      if (hasToken) {
        try{
          final token = await userRepository.getCachedToken();
          final user = await userRepository.getUser(token);
          yield AuthenticationAuthenticated(token, user);
        }
        catch(error){
          debugPrint("ERROR: "+error);
          yield AuthenticationUnauthenticated();
        }
      } else {
        yield AuthenticationUnauthenticated();
      }
    }

    if (event is LoggedIn) {
      yield AuthenticationLoading();
      final user = await userRepository.getUser(event.token);
      yield AuthenticationAuthenticated(event.token, user);
    }

    if (event is LoggedOut) {
      yield AuthenticationLoading();
      await userRepository.logout();
      yield AuthenticationUnauthenticated();
    }
  }
}