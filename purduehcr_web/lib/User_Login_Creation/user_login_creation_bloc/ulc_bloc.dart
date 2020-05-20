import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';

import 'package:purduehcr_web/BLoCs/authentication/authentication.dart';
import './ulc.dart';


class ULCBloc extends Bloc<ULCEvent, ULCState>{
  final UserRepository network;
  final BuildContext context;
  final AuthenticationBloc authenticationBloc;
  ULCBloc({ @required this.context, @required this.network, @required this.authenticationBloc})  : assert(network != null),
        assert(authenticationBloc != null);

  @override
  ULCState get initialState => ULCInitial();

  @override
  Stream<ULCState> mapEventToState( ULCEvent event) async* {
    print("Calling Map");
    if(event is Login) {
      yield ULCLoading();
      try {
        final token = await network.loginUser(
            context, event.email, event.password);

        authenticationBloc.add(LoggedIn(token: token));
        yield LoginSuccess(token);
      }
      catch (error) {
        yield ULCError(error);
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}