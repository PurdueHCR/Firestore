import 'dart:async';

import 'package:flutter/material.dart';
import 'package:meta/meta.dart';
import 'package:bloc/bloc.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/User_Login_Creation/user_login_creation_bloc/ulc_repository.dart';
import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';
import 'authentication.dart';


class AuthenticationBloc
    extends Bloc<AuthenticationEvent, AuthenticationState> {
  final Config config;
  UserRepository _userRepository;

  AuthenticationBloc({@required this.config})
      : assert(config != null){
    _userRepository = UserRepository(config);
  }

  @override
  AuthenticationState get initialState => AuthUninitialized();

  @override
  Stream<AuthenticationState> mapEventToState(AuthenticationEvent event) async* {
    if (event is AppStarted) {
      try{
        await FirebaseUtility.initializeFirebase(config);
        final user = await _userRepository.getUser();
        yield Authenticated(user);
      }
      catch(error){
        yield Unauthenticated();
      }
    }
    else if (event is LoggedIn) {
      yield Authenticated(event.user);
    }
    else if (event is LoggedOut) {
      yield AuthLoading();
      await _userRepository.logout();
      yield Unauthenticated();
    }
  }
}