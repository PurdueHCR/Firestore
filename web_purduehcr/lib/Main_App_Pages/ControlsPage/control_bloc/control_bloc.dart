import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/SystemPreferences.dart';
import 'control.dart';


class ControlBloc extends Bloc<ControlEvent, ControlState>{
  ControlRepository _controlRepository;
  final Config config;

  ControlBloc({ @required this.config})  :
        assert(config != null){
    this._controlRepository = new ControlRepository(config);
  }

  @override
  ControlState get initialState => ControlPageLoading();

  @override
  Stream<ControlState> mapEventToState( ControlEvent event) async* {
    if(event is ControlInitialize){
      try{
        SystemPreference settings = await _controlRepository.getSettings();
        print("Got settings: "+(settings.competitionDisabledMessage == null).toString());
        yield ControlLoaded(settings);
      }
      catch (error){
        print("Got error in getting system preferences: "+error);
        yield ControlInitializeError();
      }
    }
    else if(event is ControlHandledMessage){
      yield ControlLoaded(state.settings);
    }
    else if(event is UpdateSettings){
      try{
        await _controlRepository.updateSettings(
          isCompetitionEnabled: event.isCompetitionEnabled,
          competitionDisabledMessage: event.competitionDisabledMessage,
          isCompetitionVisible: event.isCompetitionVisible,
          competitionHiddenMessage: event.competitionHiddenMessage,
          isShowingRewards: event.isShowingRewards
        );
      }
      on ApiError catch(apiError){
        if(apiError.errorCode == 200){
          print("SUCCESS: update settings success");
          if(event.competitionHiddenMessage != null){
            state.settings.competitionHiddenMessage = event.competitionHiddenMessage;
          }
          if(event.isCompetitionVisible != null){
            state.settings.isCompetitionVisible = event.isCompetitionVisible;
          }
          if(event.competitionDisabledMessage != null){
            state.settings.competitionDisabledMessage = event.competitionDisabledMessage;
          }
          if(event.isCompetitionEnabled != null) {
            state.settings.isCompetitionEnabled = event.isCompetitionEnabled;
          }
          if(event.isShowingRewards != null){
            state.settings.showRewards = event.isShowingRewards;
          }
          yield ControlLoaded(state.settings);
        }
        else{
          print("Failed. There was an error... "+apiError.message);
          yield ControlUpdateError(state.settings);
        }
      }
      catch(error){
        print("There was an error updating the link: "+error.toString());
        yield ControlUpdateError(state.settings);
      }
    }
    else if(event is RequestBackup){
      try{
        await _controlRepository.requestBackup();
      }
      on ApiError catch(apiError){
        if(apiError.errorCode == 200){
          yield ControlEmailSent(state.settings);
        }
        else{
          print("Failed. There was an error... "+apiError.message);
          yield ControlEmailError("Sorry. There was a problem requesting the email. Please try again.", state.settings);
        }
      }
      catch(error){
        print("There was an error getting an email: "+error.toString());
        yield ControlEmailError("Sorry. There was a problem requesting the email. Please try again.", state.settings);
      }
    }
    else if(event is EndSemester){
      try{
        await _controlRepository.endSemester();
      }
      on ApiError catch(apiError){
        if(apiError.errorCode == 200){
          yield ControlEmailSent(state.settings);
        }
        else if(apiError.errorCode == 414){
          print("Competition must be disabled");
          yield ControlEmailError("Sorry. The competition has to be disabled first before you can end the semester.", state.settings);
        }
        else{
          print("Failed. There was an error... "+apiError.message);
          yield ControlEmailError("Sorry. There was a problem requesting the email. Please try again.", state.settings);
        }
      }
      catch(error){
        print("There was an error getting an email: "+error.toString());
        yield ControlEmailError("Sorry. There was a problem requesting the email. Please try again.", state.settings);
      }
    }
    else if(event is ResetCompetition){
      try{
        await _controlRepository.resetCompetition();
      }
      on ApiError catch(apiError){
        if(apiError.errorCode == 200){
          yield ControlEmailSent(state.settings);
        }
        else if(apiError.errorCode == 414){
          print("Competition must be disabled");
          yield ControlEmailError("Sorry. The competition has to be disabled first before you can reset the competition.", state.settings);
        }
        else{
          print("Failed. There was an error... "+apiError.message);
          yield ControlEmailError("Sorry. There was a problem requesting the email. Please try again.", state.settings);
        }
      }
      catch(error){
        print("There was an error getting an email: "+error.toString());
        yield ControlEmailError("Sorry. There was a problem requesting the email. Please try again.", state.settings);
      }
    }


  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}