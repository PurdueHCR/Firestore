import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/HouseCode.dart';
import 'package:purduehcr_web/Models/User.dart';
import 'find_users.dart';


class FindUsersBloc extends Bloc<FindUsersEvent, FindUsersState>{
  FindUsersRepository _findUsersRepository;
  final Config config;
  Future<List<HouseCode>> houseCodes;

  FindUsersBloc({ @required this.config})  :
        assert(config != null), super(FindUsersPageLoaded()) {
    this._findUsersRepository = new FindUsersRepository(config);
  }

  // TODO: Remove?
  // @override
  // FindUsersState get initialState => FindUsersPageLoaded();

  @override
  Stream<FindUsersState> mapEventToState( FindUsersEvent event) async* {
    if(event is FindUsers){
      try{
        yield FindUsersLoading();
        List<User> users = [];
        if(event.previousName == null){
          users = await _findUsersRepository.searchForUsersWithTerm(event.term);
        }
        else{
          users = await _findUsersRepository.searchForUsersWithTerm(event.term, previousQueryLast: event.previousName);
        }
        yield FindUsersLoaded(users);
      }
      catch (error){
        print("Got error finding users: "+error);
        yield FindUsersError();
      }
    }
    if(event is UpdateUser){
      try{
        await _findUsersRepository.updateUser(event.user,
          first: event.first,
          last: event.last,
          house: event.house,
          floorId: event.floorId,
          permissionLevel: event.permissionLevel,
          enabled: event.enabled
        );
      }
      on ApiError catch(apiError){
        if(apiError.errorCode == 200){
          if(event.first != null){
            event.user.firstName = event.first;
          }
          if(event.last != null){
            event.user.lastName = event.last;
          }
          if(event.house != null){
            event.user.house = event.house;
          }
          if(event.permissionLevel != null){
            event.user.permissionLevel = event.permissionLevel;
          }
          if(event.floorId != null){
            event.user.floorId = event.floorId;
          }
          if(event.enabled != null){
            event.user.enabled = event.enabled;
          }
          yield FindUsersLoaded(state.users);
        }
        else{
          print("Failed. There was an API error updating the user "+apiError.message);
          yield UpdateUserError(state.users);
        }
      }
      catch(error){
        print("Failed. There was an error... "+error.toString());
        yield UpdateUserError(state.users);
      }
    }
    else if(event is HandleMessage){
      yield FindUsersLoaded(state.users);
    }
  }

  Future<List<HouseCode>> getHouseCodes(){
    if(houseCodes == null){
      houseCodes = _findUsersRepository.getHouseCodes();
    }
    return houseCodes;
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}