import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/Link.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'link.dart';


class LinkBloc extends Bloc<LinkEvent, LinkState>{
  LinkRepository _linkRepository;
  final Config config;

  LinkBloc({ @required this.config})  :
        assert(config != null){
    this._linkRepository = new LinkRepository(config);
  }

  @override
  LinkState get initialState => LinkLoading();

  @override
  Stream<LinkState> mapEventToState( LinkEvent event) async* {
    if(event is LinkInitialize){
      yield LinkLoading();
      var links = await _linkRepository.getLinks();
      yield LinkPageLoaded(links);
    }
    else if(event is CreateLink){
      try{
        Link link = await _linkRepository.createLink(event.description, event.enabled, event.singleUse, event.pointTypeId);
        state.links.add(link);
        print("SUCCESS: create link success");
        yield LinkSuccess(links: state.links, shouldDismissDialog: event.shouldDismissDialog, message: "Link Created");
      }
      on ApiError catch(apiError){
        if(apiError.errorCode == 200 || apiError.errorCode == 201){
          print("SUCCESS: create link success");
          yield LinkSuccess(links: state.links, shouldDismissDialog: event.shouldDismissDialog, message: "Link Created");
        }
        else{
          print("Failed. There was an error... ");
          yield LinkError(state.links, message: apiError.message, shouldDismissDialog: event.shouldDismissDialog);
        }
      }
      catch(error){
        print("There was an error loading the point types: "+error.toString());
        yield LinkError(state.links, message: error.toString(), shouldDismissDialog: event.shouldDismissDialog);
      }
    }
    else if(event is LinkDisplayedMessage){
      yield LinkPageLoaded(state.links);
    }
    else if(event is UpdateLink){
      try{
        await _linkRepository.updateLink(event.link);
        print("SUCCESS: update link success");
        yield LinkSuccess(links: state.links, shouldDismissDialog: event.shouldDismissDialog, message: "Link Updated");
      }
      on ApiError catch(apiError){
        if(apiError.errorCode == 200 || apiError.errorCode == 201){
          print("SUCCESS: update link success");
          yield LinkSuccess(links: state.links, shouldDismissDialog: event.shouldDismissDialog, message: "Link Updated");
        }
        else{
          print("Failed. There was an error... "+apiError.message);
          yield LinkError(state.links, message: apiError.message, shouldDismissDialog: event.shouldDismissDialog);
        }
      }
      catch(error){
        print("There was an error updating the link: "+error.toString());
        yield LinkError(state.links, message: error.toString(), shouldDismissDialog: event.shouldDismissDialog);
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }

  Future<List<PointType>> getPointTypes(){
    return _linkRepository.getPointTypes();
  }
}