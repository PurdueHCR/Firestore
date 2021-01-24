import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'my_events.dart';


class MyEventsBloc extends Bloc<MyEventsEvent, MyEventsState>{
  MyEventsRepository _myEventsRepository;
  final Config config;

  MyEventsBloc({ @required this.config})  :
        assert(config != null){
    this._myEventsRepository = new MyEventsRepository(config);
  }

  @override
  MyEventsState get initialState => MyEventsPageLoading();

  @override
  Stream<MyEventsState> mapEventToState( MyEventsEvent event) async* {
    if(event is MyEventsInitialize){
      try{
          yield MyEventsPageLoaded([]);
      }
      catch (error){
          print("Got error in initializing MyEventsPage: "+error);
          yield MyEventsPageInitializeError();
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}