import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';

import 'package:purduehcr_web/BLoCs/authentication/authentication.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';
import './ulc.dart';


class ULCBloc extends Bloc<ULCEvent, ULCState>{
  UserRepository _userRepository;
  final Config config;
  final AuthenticationBloc authenticationBloc;
  FirebaseUtility _firebaseUtility;

  ULCBloc({ @required this.config,@required this.authenticationBloc})  :
        assert(authenticationBloc != null){
    this._userRepository = new UserRepository(config);
    this._firebaseUtility = new FirebaseUtility(config);
  }

  @override
  ULCState get initialState => ULCInitial();

  @override
  Stream<ULCState> mapEventToState( ULCEvent event) async* {
    if(event is ULCInitialize){
      try {
        await _firebaseUtility.initializeFirebase();
        User user = await _userRepository.getUser();
        authenticationBloc.add(LoggedIn(user: user));
        print("Log in success");
        yield LoginSuccess();
      }
      catch (error) {
        print(error.toString());
        yield ULCInitial();
      }
    }
    if(event is Login) {
      yield ULCLoading();
      try {
        await _userRepository.loginUser(event.email, event.password);
        User user = await _userRepository.getUser();
        authenticationBloc.add(LoggedIn(user: user));
        print("Log in success here");
        yield LoginSuccess();
      }
      on ApiError catch(apiError){
        print("GOT API ERROR: "+apiError.toString());
        yield ULCError(apiError.toString());
      }
      catch (error) {
        print("GOT LOGIN ERROR: "+error.toString());
        yield ULCError(error);
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}