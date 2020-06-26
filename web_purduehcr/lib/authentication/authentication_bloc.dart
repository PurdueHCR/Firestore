import 'dart:async';
import 'dart:html';

import 'package:flutter/material.dart';
import 'package:meta/meta.dart';
import 'package:bloc/bloc.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';
import 'package:purduehcr_web/authentication/authentication_repository.dart';
import 'authentication.dart';


class AuthenticationBloc
    extends Bloc<AuthenticationEvent, AuthenticationState> {
  final Config config;
  AuthenticationRepository _authenticationRepository;

  AuthenticationBloc({@required this.config})
      : assert(config != null){
    _authenticationRepository = AuthenticationRepository(config);
  }

  @override
  AuthenticationState get initialState => AuthUninitialized();

  @override
  Stream<AuthenticationState> mapEventToState(AuthenticationEvent event) async* {
    if (event is AppStarted) {
      try{
        await FirebaseUtility.initializeFirebase(config);
        final user = await _authenticationRepository.getUser();
        yield Authenticated(user);
      }
      catch(error){
        yield Unauthenticated();
      }
    }
    else if (event is LoggedIn) {
      try{
        final user = await _authenticationRepository.getUser();
        yield Authenticated(user);
      }
      on ApiError catch(apiError){
        window.console.log("Failed to get User model with API Error. $apiError");
        yield AuthenticatedButNoUser();
      }
      catch(error){
        window.console.log("Failed to get User model. $error");
        yield Unauthenticated();
      }

    }
    else if (event is LoggedOut) {
      yield AuthLoading();
      await _authenticationRepository.logout();
      yield Unauthenticated();
    }
  }
}