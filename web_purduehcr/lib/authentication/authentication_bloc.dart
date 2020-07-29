import 'dart:async';
import 'package:flutter/material.dart';
import 'package:meta/meta.dart';
import 'package:bloc/bloc.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/SystemPreferences.dart';
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
      SystemPreference preferences;
      try{
        await FirebaseUtility.initializeFirebase(config);
        preferences = await _authenticationRepository.getSystemPreferences();
        final user = await _authenticationRepository.getUser();
        yield Authenticated(user, preferences: preferences);
      }
      on ApiError catch(apiError){
        if(apiError.errorCode == 400){
          yield AuthenticatedButNoUser(preferences: preferences);
        }
        else{
          print("Uh oh. There was an API error: "+apiError.toString());
          yield Unauthenticated(preferences: preferences);
        }
      }
      catch(error){
        print("Uh oh. There was an error");
        yield ConnectionErrorState(preferences: preferences);
      }
    }
    else if (event is LoggedIn) {
      try{
        final user = await _authenticationRepository.getUser();
        yield Authenticated(user, preferences: state.preferences);
      }
      on ApiError catch(apiError){
        print("Failed to get User model with API Error. $apiError");
        yield AuthenticatedButNoUser(preferences: state.preferences);
      }
      catch(error){
        print("Failed to get User model. $error");
        yield ConnectionErrorState(preferences: state.preferences);
      }

    }
    else if (event is LoggedOut) {
      yield AuthLoading(preferences: state.preferences);
      try{
        await _authenticationRepository.logout();
        yield Unauthenticated(preferences: state.preferences);
      }
      catch(error){
        yield ConnectionErrorState(preferences: state.preferences);
      }
    }
    else if (event is CreatedAccount){
      yield Authenticated(event.user, preferences: state.preferences);
    }
  }
}