import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/Reward.dart';
import 'rewards.dart';


class RewardsBloc extends Bloc<RewardsEvent, RewardsState>{
  RewardsRepository _rewardsRepository;
  final Config config;

  RewardsBloc({ @required this.config})  :
        assert(config != null), super(RewardsPageLoading()) {
    this._rewardsRepository = new RewardsRepository(config);
  }

  // TODO: Remove?
  // @override
  // RewardsState get initialState => RewardsPageLoading();

  @override
  Stream<RewardsState> mapEventToState( RewardsEvent event) async* {
    if(event is RewardHandleMessage){
      yield RewardsPageLoaded(state.rewards);
    }
    else if(event is RewardsInitialize){
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
        await _rewardsRepository.updateReward(event.reward, name: event.name, fileName: event.fileName, downloadURL: event.downloadURL, pointsPerResident: event.pointsPerResident);
        print("Update returned when it should have thrown 200");
        yield UpdateRewardsError(state.rewards);
      }
      on ApiError catch(error){
        if(error.errorCode == 200){
          if(event.name != null){
            event.reward.name = event.name;
          }
          if(event.fileName != null){
            event.reward.fileName = event.fileName;
          }
          if(event.downloadURL != null){
            event.reward.downloadURL = event.downloadURL;
          }
          if(event.pointsPerResident != null){
            event.reward.requiredPPR = event.pointsPerResident;
          }
          yield RewardsPageLoaded(state.rewards);
        }
        else{
          print("Got error in update a reward: "+error.toString());
          yield UpdateRewardsError(state.rewards);
        }
      }
      catch (error){
        print("Got error in initializing RewardsPage: "+error);
        yield UpdateRewardsError(state.rewards);
      }
    }
    else if(event is DeleteReward){
      try{
        await _rewardsRepository.deleteReward(event.reward);
        yield DeleteRewardsError(state.rewards);
      }
      on ApiError catch(error){
        if(error.errorCode == 200){
          state.rewards.remove(event.reward);
          yield DeleteRewardSuccess(state.rewards);
        }
        else{
          print("Got error in creating a reward: "+error.toString());
          yield DeleteRewardsError(state.rewards);
        }
      }
      catch (error){
        print("Got error in initializing RewardsPage: "+error);
        yield DeleteRewardsError(state.rewards);
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}