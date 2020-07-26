import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/Reward.dart';
import 'rewards.dart';


class RewardsBloc extends Bloc<RewardsEvent, RewardsState>{
  RewardsRepository _rewardsRepository;
  final Config config;

  RewardsBloc({ @required this.config})  :
        assert(config != null){
    this._rewardsRepository = new RewardsRepository(config);
  }

  @override
  RewardsState get initialState => RewardsPageLoading();

  @override
  Stream<RewardsState> mapEventToState( RewardsEvent event) async* {
    if(event is RewardsInitialize){
      try{
          List<Reward> rewards = await _rewardsRepository.getRewards();
          yield RewardsPageLoaded(rewards);
      }
      catch (error){
          print("Got error in initializing RewardsPage: "+error);
          yield RewardsPageInitializeError();
      }
    }
    else if(event is CreateReward){
      try{
        //request
        Reward reward = await _rewardsRepository.createReward(event.name, event.fileName, event.downloadURL, event.pointsPerResident);
        state.rewards.add(reward);
        state.rewards.sort((a,b) => (a.requiredPPR - b.requiredPPR).toInt());
        yield CreateRewardsSuccess(state.rewards);
      }
      on ApiError catch(error){
        print("Got error in creating a reward: "+error.toString());
        yield CreateRewardsError(state.rewards);
      }
      catch (error){
        print("Got error in initializing RewardsPage: "+error);
        yield CreateRewardsError(state.rewards);
      }
    }
    else if(event is UpdateReward){
      try{
        yield UpdateRewardsError(state.rewards);
      }
      on ApiError catch(error){
        if(error.errorCode == 200){
          yield RewardsPageLoaded(state.rewards);
        }
        else{
          print("Got error in creating a reward: "+error.toString());
        }
      }
      catch (error){
        print("Got error in initializing RewardsPage: "+error);
        yield CreateRewardsError(state.rewards);
      }
    }
    else if(event is DeleteReward){
      try{
        print("DELTE REWARD IS UNIMPLEMENTED");
        yield DeleteRewardsError(state.rewards);
      }
      on ApiError catch(error){
        if(error.errorCode == 200){
          yield RewardsPageLoaded(state.rewards);
        }
        else{
          print("Got error in creating a reward: "+error.toString());
        }
      }
      catch (error){
        print("Got error in initializing RewardsPage: "+error);
        yield CreateRewardsError(state.rewards);
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}