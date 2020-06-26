import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';

import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/UserCreation/user_creation/user_creation.dart';
import 'package:purduehcr_web/authentication/authentication.dart';



class UserCreationBloc extends Bloc<UserCreationEvent, UserCreationState>{
  //UserCreationRepository _userCreationRepository;
  final Config config;
  final AuthenticationBloc authenticationBloc;

  UserCreationBloc({ @required this.config,@required this.authenticationBloc})  :
        assert(authenticationBloc != null){
    //this._accountRepository = new AccountRepository(config);
  }

  @override
  UserCreationState get initialState => UserCreationPageInitial();

  @override
  Stream<UserCreationState> mapEventToState( UserCreationEvent event) async* {
    if(event is UserCreationPageInitialize){
      yield UserCreationPageInitial();
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}