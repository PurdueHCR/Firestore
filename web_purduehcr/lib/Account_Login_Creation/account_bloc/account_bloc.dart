import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';

import 'package:purduehcr_web/authentication/authentication.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/Utilities/FirebaseUtility.dart';
import './account.dart';


class AccountBloc extends Bloc<AccountEvent, AccountState>{
  AccountRepository _accountRepository;
  final Config config;
  final AuthenticationBloc authenticationBloc;

  AccountBloc({ @required this.config,@required this.authenticationBloc})  :
        assert(authenticationBloc != null){
    this._accountRepository = new AccountRepository(config);
  }

  @override
  AccountState get initialState => AccountInitial();

  @override
  Stream<AccountState> mapEventToState( AccountEvent event) async* {
    if(event is AccountInitialize){
      yield AccountInitial();
    }
    else if(event is CreateAccountInitialize){
      yield CreateAccountInitial();
    }
    else if(event is CreateAccount){
      yield AccountLoading();
      try {
        RegExp regExp = new RegExp(
          r".*@purdue\.edu",
        );
        if(!regExp.hasMatch(event.email)){
          yield CreateAccountError(message: "Invalid email. Please use your @purdue.edu email address");
        }
        else if(event.verifyPassword == event.password){
          await _accountRepository.createAccount(event.email, event.password);
          authenticationBloc.add(LoggedIn());
        }
        else{
          yield CreateAccountError(message: "Please make sure your passwords match");
        }

      }
      on ApiError catch(apiError){
        print("GOT API ERROR: "+apiError.toString());
        yield CreateAccountError(message: apiError.toString());
      }
      catch (error) {
        print("GOT Create Account ERROR in BLOC: $error");
        yield CreateAccountError(message: error);
      }
    }
    else if(event is Login) {
      yield AccountLoading();
      try {
        await _accountRepository.loginUser(event.email, event.password);
        authenticationBloc.add(LoggedIn());
      }
      on ApiError catch(apiError){
        print("GOT API ERROR: "+apiError.toString());
        yield AccountError(message: apiError.toString());
      }
      catch (error) {
        print("GOT LOGIN ERROR in BLOC: $error");
        yield AccountError(message: error);
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}