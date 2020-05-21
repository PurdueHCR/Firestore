import 'dart:async';
import 'dart:html';

import 'package:flutter/material.dart';
import 'package:meta/meta.dart';
import 'package:bloc/bloc.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/User_Login_Creation/user_login_creation_bloc/ulc_repository.dart';
import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';
import 'authentication.dart';


class AuthenticationBloc
    extends Bloc<AuthenticationEvent, AuthenticationState> {
  final UserRepository userRepository;

  AuthenticationBloc({@required this.userRepository})
      : assert(userRepository != null);

  @override
  AuthenticationState get initialState => AuthUninitialized();

  @override
  Stream<AuthenticationState> mapEventToState(AuthenticationEvent event) async* {
    if (event is AppStarted) {
      try{
        await FirebaseUtility.initializeFirebase(event.context);
        final user = await userRepository.getUser();
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
      await userRepository.logout();
      yield Unauthenticated();
    }
  }
}