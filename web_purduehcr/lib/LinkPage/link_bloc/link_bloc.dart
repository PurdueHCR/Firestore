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
  Future<List<PointType>> pointTypes;

  LinkBloc({ @required this.config})  :
        assert(config != null){
    this._linkRepository = new LinkRepository(config);
  }

  @override
  LinkState get initialState => LinkLoading();

  @override
  Stream<LinkState> mapEventToState( LinkEvent event) async* {
    if(event is LinkInitialize){
      try{
        yield LinkLoading();
        var links = await _linkRepository.getLinks();
        yield LinkPageLoaded(links);
      }
      on ApiError catch(apiError){
        print("Failed. There was an error... "+apiError.message);
        yield LoadLinksError();
      }
      catch(error){
        print("There was an error loading the point types: "+error.toString());
        yield LoadLinksError();
      }
    }
    else if(event is CreateLink){
      try{
        Link link = await _linkRepository.createLink(event.description, event.enabled, event.singleUse, event.pointTypeId);
        state.links.add(link);
        print("SUCCESS: create link success");
        yield CreateLinkSuccess(links: state.links);
      }
      on ApiError catch(apiError){
        print("Failed. There was an api error... "+apiError.message);
        yield CreateLinkError(state.links);
      }
      catch(error){
        print("There was an error loading the point types: "+error.toString());
        yield CreateLinkError(state.links);
      }
    }
    else if(event is LinkDisplayedMessage){
      yield LinkPageLoaded(state.links);
    }
    else if(event is UpdateLink){
      try{
        await _linkRepository.updateLink(event.link,
          description: event.description,
          singleUse: event.singleUse,
          enabled: event.enabled,
          archived: event.archived
        );
      }
      on ApiError catch(apiError){
        if(apiError.errorCode == 200){
          print("SUCCESS: update link success");
          yield UpdateLinkSuccess(state.links, event.link, description: event.description, enabled: event.enabled, singleUse: event.singleUse, archived: event.archived);
        }
        else{
          print("Failed. There was an error... "+apiError.message);
          yield UpdateLinkError(state.links, event.link);
        }
      }
      catch(error){
        print("There was an error updating the link: "+error.toString());
        yield UpdateLinkError(state.links, event.link);
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }

  Future<List<PointType>> getPointTypes(){
    if(pointTypes == null){
      pointTypes = _linkRepository.getPointTypes();
    }
    return pointTypes;
  }
}