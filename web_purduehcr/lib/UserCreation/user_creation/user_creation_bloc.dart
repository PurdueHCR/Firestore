import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';

import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'package:purduehcr_web/UserCreation/user_creation/user_creation.dart';
import 'package:purduehcr_web/authentication/authentication.dart';



class UserCreationBloc extends Bloc<UserCreationEvent, UserCreationState>{
  UserCreationRepository _userCreationRepository;
  final Config config;
  final AuthenticationBloc authenticationBloc;

  UserCreationBloc({ @required this.config,@required this.authenticationBloc})  :
        assert(authenticationBloc != null){
    _userCreationRepository = UserCreationRepository(config);
  }

  @override
  UserCreationState get initialState => EnterHouseCodeState();

  @override
  Stream<UserCreationState> mapEventToState( UserCreationEvent event) async* {
    if(event is EnterHouseCode){
      yield LoadingUserCreationInformation();
      try{
        HouseCodePreview preview = await _userCreationRepository.getHouseInformationFromHouseCode(event.houseCode);
        yield EnterFirstAndLastNameState(preview);
      }
      on ApiError catch(error){
        print("Got an API error: "+error.toString());
        if(error.errorCode == 415){
          yield EnterHouseCodeStateError("The house code was not found. Please verify your code is correct.");
        }
        else{
          yield EnterHouseCodeStateError("Sorry, there was an error. Please try again.");
        }
      }
      catch (error){
        print("Got an error: "+error.toString());
        yield EnterHouseCodeStateError("Sorry, there was an error. Please try again.");
      }
    }
    else if(event is JoinHouse){
      EnterFirstAndLastNameState currentState = state as EnterFirstAndLastNameState;
      yield LoadingUserCreationInformation();
      try{
        User user = await _userCreationRepository.joinHouse(event.houseCode, event.firstName, event.lastName);
        authenticationBloc.add(CreatedAccount(user));
      }
      on ApiError catch(error){
        print("Got an API error: "+error.toString());
        yield EnterFirstAndLastNameStateError(currentState.preview, "Sorry, there was an error. Please try again.");
      }
      catch (error){
        print("Got an error: "+error.toString());
        yield EnterFirstAndLastNameStateError(currentState.preview, "Sorry, there was an error. Please try again.");
      }
    }
    else if(event is ReturnToEnterHouseCode){
      yield EnterHouseCodeState();
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}