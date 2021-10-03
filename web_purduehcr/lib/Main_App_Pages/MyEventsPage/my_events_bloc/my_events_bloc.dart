import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/Event.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'my_events.dart';


class MyEventsBloc extends Bloc<MyEventsEvent, MyEventsState>{
  MyEventsRepository _myEventsRepository;
  Future<List<PointType>> pointTypes;
  final Config config;

  MyEventsBloc({ @required this.config})  :
        assert(config != null), super(null){
    this._myEventsRepository = new MyEventsRepository(config);
  }

  @override
  MyEventsState get initialState => MyEventsPageLoading();

  @override
  Stream<MyEventsState> mapEventToState( MyEventsEvent event) async* {
    if(event is MyEventsInitialize){
      yield MyEventsPageLoading();
      try{
          yield MyEventsPageLoaded(await _myEventsRepository.getMyEvents());
      }
      catch (error){
          print("Got error in initializing MyEventsPage: "+error);
          yield MyEventsPageInitializeError();
      }
    }
    else if(event is CreateEvent){
      try{
        Event ev = await _myEventsRepository.createEvent(event);
        state.myEvents.add(ev);
        yield EventCreationSuccess(state.myEvents);
      }
      catch (error){
        print("Got error in initializing MyEventsPage: "+error.toString());
        yield MyEventsPageCreateEventError(state.myEvents);
      }
    }
    else if(event is UpdateEvent){
      try{
        Event ev = await _myEventsRepository.updateEvent(event);
        event.event.copyValues(ev);
        yield EventUpdateSuccess(state.myEvents);
      }
      on ApiError catch(apiError){
        print("Failed. There was an error... "+apiError.message);
        yield EventUpdateError(state.myEvents);
      }
      catch(error){
        print("There was an error updating the link: "+error.toString());
        yield EventUpdateError(state.myEvents);
      }
    }
    else if(event is DeleteEvent){
      try{
        await _myEventsRepository.deleteEvent(event.event);
        state.myEvents.remove(event.event);
        yield EventDeleteSuccess(state.myEvents);
      }
      on ApiError catch(apiError){
        if(apiError.errorCode == 200){
          state.myEvents.remove(event.event);
          yield EventDeleteSuccess(state.myEvents);
        }
        else{
          print("Failed. There was an error... "+apiError.message);
          yield EventDeleteError(state.myEvents);
        }
      }
      catch(error){
        print("There was an error deleting the event: "+error.toString());
        yield EventDeleteError(state.myEvents);
      }
    }
    else if(event is EventHandledMessage){
      yield MyEventsPageLoaded(state.myEvents);
    }
    else if(event is DisplayCreateEventState){
      yield CreateEventState(state.myEvents);
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }

  Future<List<PointType>> getPointTypes(){
    if(pointTypes == null){
      pointTypes = _myEventsRepository.getPointTypes();
    }
    return pointTypes;
  }
}