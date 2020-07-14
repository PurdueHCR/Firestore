import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/Link.dart';
import 'handle_link.dart';


class HandleLinkBloc extends Bloc<HandleLinkEvent, HandleLinkState>{
  HandleLinkRepository _handleLinkRepository;
  final Config config;

  HandleLinkBloc({ @required this.config})  :
        assert(config != null){
    this._handleLinkRepository = new HandleLinkRepository(config);
  }

  @override
  HandleLinkState get initialState => HandleLinkLoading();

  @override
  Stream<HandleLinkState> mapEventToState( HandleLinkEvent event) async* {
    if(event is HandleLinkInitialize){
      try{
        Link link = await _handleLinkRepository.getLink(event.linkId);
        yield LinkLoaded(link);
      }
      on ApiError catch(apiError){
        print("Failed. There was an error... ");
        yield HandleLinkError(message: apiError.message);
      }
      catch(error){
        print("There was an error loading the point types: "+error.toString());
        yield HandleLinkError(message: error.toString());
      }
    }
    else if(event is SubmitLinkForPoints){
      try{
        await _handleLinkRepository.submitLink(event.linkId);
      }
      on ApiError catch(apiError){
        if(apiError.errorCode == 200 || apiError.errorCode == 201){
          yield SubmitLinkForPointsSuccess();
        }
        else{
          print("Failed. There was an error... ");
          yield HandleLinkError(message: apiError.message);
        }
      }
      catch(error){
        print("There was an error submitting the link: "+error.toString());
        yield HandleLinkError(message: "Uh oh. Something unexpected happened. Please try again.");
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}