import 'dart:async';
import 'package:flutter/material.dart';
import 'package:meta/meta.dart';
import 'package:bloc/bloc.dart';
import 'package:provider/provider.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/SystemPreferences.dart';
import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';
import 'package:purduehcr_web/Utilities/ThemeNotifier.dart';
import 'package:purduehcr_web/Authentication_Bloc/authentication_repository.dart';
import 'authentication.dart';


class AuthenticationBloc
    extends Bloc<AuthenticationEvent, AuthenticationState> {
  final Config config;
  final ThemeNotifier themeNotifier;
  AuthenticationRepository _authenticationRepository;

  AuthenticationBloc({@required this.config, @required this.themeNotifier})
      : assert(config != null), assert(themeNotifier != null){
    _authenticationRepository = AuthenticationRepository(config);
  }

  @override
  AuthenticationState get initialState => AuthUninitialized();

  @override
  Stream<AuthenticationState> mapEventToState(AuthenticationEvent event) async* {
    print('Printing state');
    if (event is AppStarted && state.preferences == null) {
      SystemPreference preferences;
      try{
        await FirebaseUtility.initializeFirebase(config);
        preferences = await _authenticationRepository.getSystemPreferences();
        final initializationData = await _authenticationRepository.getInitializationData();
        if(initializationData.house != null && themeNotifier.getMainColor() != initializationData.house.getHouseColor()){
          themeNotifier.setMainColor(initializationData.house.getHouseColor());
        }
        yield Authenticated(initializationData.user, initializationData.house, preferences: preferences);
      }
      on ApiError catch(apiError){
        if(apiError.errorCode == 400){
          yield AuthenticatedButNoUser(preferences: preferences);
        }
        else{
          yield Unauthenticated(preferences: preferences);
        }
      }
      catch(error){
        print('Start App unknown error: '+error.toString());
        yield ConnectionErrorState(preferences: preferences);
      }
    }
    else if (event is LoggedIn) {
      try{
        final initializationData = await _authenticationRepository.getInitializationData();
        if(initializationData.house != null && themeNotifier.getMainColor() != initializationData.house.getHouseColor()){
          themeNotifier.setMainColor(initializationData.house.getHouseColor());
        }
        yield Authenticated(initializationData.user, initializationData.house, preferences: initializationData.settings);
      }
      on ApiError catch(apiError){
        yield AuthenticatedButNoUser(preferences: state.preferences, houseCode: event.houseCode);
      }
      catch(error){
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
    else if (event is CreatedUser){
      try{
        final initializationData = await _authenticationRepository.getInitializationData();
        if(initializationData.house != null && themeNotifier.getMainColor() != initializationData.house.getHouseColor()){
          themeNotifier.setMainColor(initializationData.house.getHouseColor());
        }
        yield Authenticated(initializationData.user, initializationData.house, preferences: initializationData.settings);

      }
      on ApiError catch(apiError){
        yield Unauthenticated(preferences: state.preferences);
      }
      catch(error){
        print("Failed to get User . $error");
        yield ConnectionErrorState(preferences: state.preferences);
      }
    }
    else if(event is UpdateUser){
      try{
        print("Please update user");
        final initializationData = await _authenticationRepository.getInitializationData();
        (state as Authenticated).user.totalPoints = initializationData.user.totalPoints;
        (state as Authenticated).user.totalPoints = initializationData.user.semesterPoints;
        print("DID IT");
      }
      catch(error){
        print("Failed to update User . $error");
      }
    }
  }
}