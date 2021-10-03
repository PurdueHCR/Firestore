import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'history.dart';


class HistoryBloc extends Bloc<HistoryEvent, HistoryState>{
  HistoryRepository _historyRepository;
  final Config config;
  Future<List<PointType>> getPointTypes;

  HistoryBloc({ @required this.config})  :
        assert(config != null), super(null){
    this._historyRepository = new HistoryRepository(config);
  }

  @override
  HistoryState get initialState => HistoryPageLoaded(searchType: "recent");

  @override
  Stream<HistoryState> mapEventToState( HistoryEvent event) async* {
    if(event is SelectSearchType){
      if(event.searchType == "point_type" && getPointTypes == null){
        getPointTypes = _historyRepository.getPointTypes();
      }
      yield HistoryPageLoaded(searchType: event.searchType, logs:state.logs, lastEvent: state.lastEvent, house: state.house);
    }
    if(event is SelectHouse){
      yield HistoryPageLoaded(searchType: state.searchType, logs:state.logs, lastEvent: state.lastEvent, house: event.house);
    }
    else if(event is SearchRecent){
      try{
        yield HistoryPageContentLoading(searchType:"recent", house: state.house);
        List<PointLog> logs = await _historyRepository.getRecentHistory(date:event.date, house: state.house);
        yield HistoryPageLoaded(searchType: "recent", logs:logs, lastEvent: event, currentIndex: 0, house: state.house);
      }
      catch(error){
        yield HistoryPageError(searchType: "recent", logs:state.logs, lastEvent: event, currentIndex: 0, house: state.house);
      }
    }
    else if(event is SearchUser){
      try {
        yield HistoryPageContentLoading(searchType: "user", house: state.house);
        List<PointLog> logs = await _historyRepository.getUserHistory(
            event.userLastName, house: state.house);
        yield HistoryPageLoaded(
            searchType: "user", logs: logs, lastEvent: event, currentIndex: 0, house: state.house);
      }
      catch(error){
        yield HistoryPageError(searchType: "user", logs:state.logs, lastEvent: event, currentIndex: 0, house: state.house);
      }
    }
    else if(event is SearchPointType){
      try{
        yield HistoryPageContentLoading(searchType:"point_type", house: state.house);
        List<PointLog> logs = await _historyRepository.getPointTypeHistory(event.pointType, house: state.house);
        yield HistoryPageLoaded(searchType: "point_type", logs:logs, lastEvent: event, currentIndex: 0, house: state.house);
      }
      catch(error){
        yield HistoryPageError(searchType: "point_type", logs:state.logs, lastEvent: event, currentIndex: 0, house: state.house);
      }
    }
    else if(event is SearchNext){
      try{
        yield HistoryPageContentLoading(searchType:state.searchType, logs:state.logs, lastEvent: state.lastEvent, house: state.house);
        List<PointLog> logs;
        SearchEvent lastEvent = state.lastEvent;
        if(lastEvent is SearchRecent){
          logs = await _historyRepository.getRecentHistory(date:lastEvent.date, startAt: state.logs[state.logs.length - 1].dateSubmitted, house: state.house);
        }
        else if(lastEvent is SearchUser){
          logs = await _historyRepository.getUserHistory(lastEvent.userLastName, startAt: state.logs[state.logs.length - 1].dateSubmitted, house: state.house);
        }
        else if(lastEvent is SearchPointType){
          logs = await _historyRepository.getPointTypeHistory(lastEvent.pointType, startAt: state.logs[state.logs.length - 1].dateSubmitted, house: state.house);
        }
        state.logs.addAll(logs);
        yield HistoryPageLoaded(searchType: state.lastEvent.searchType, logs:state.logs, lastEvent: state.lastEvent, house: state.house);
      }
      catch(error){
        yield HistoryPageError(searchType: state.lastEvent.searchType, logs:state.logs, lastEvent: state.lastEvent, house: state.house);
      }
    }

  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}