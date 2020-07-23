import 'dart:async';
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
        print("Failed to get User model with API Error. $apiError");
        // TODO Handle No user.
        // Right now if there is no user model, authBLoC will yield unauthenticated
        // . However, because the previous state was Unauthenticated (thus
        // showing the login page), the app will not actually change states, so
        // the current login page will continue to be displayed
        // which is currently being told to show the loading widget.
        yield Unauthenticated();
      }
      catch(error){
        print("Failed to get User model. $error");
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