import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import './history.dart';


class HistoryBloc extends Bloc<HistoryEvent, HistoryState>{
  HistoryRepository _historyRepository;
  final Config config;
  Future<List<PointType>> getPointTypes;

  HistoryBloc({ @required this.config})  :
        assert(config != null){
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
      yield HistoryPageLoaded(searchType: event.searchType, logs:state.logs, lastEvent: state.lastEvent);
    }
    else if(event is SearchRecent){
      yield HistoryPageLoading(searchType:"recent");
      List<PointLog> logs = await _historyRepository.getRecentHistory(date:event.date);
      yield HistoryPageLoaded(searchType: "recent", logs:logs, lastEvent: event, currentIndex: 0);
    }
    else if(event is SearchUser){
      yield HistoryPageLoading(searchType:"user");
      List<PointLog> logs = await _historyRepository.getUserHistory(event.userLastName);
      yield HistoryPageLoaded(searchType: "user", logs:logs, lastEvent: event, currentIndex: 0);
    }
    else if(event is SearchPointType){
      yield HistoryPageLoading(searchType:"point_type");
      List<PointLog> logs = await _historyRepository.getPointTypeHistory(event.pointType);
      yield HistoryPageLoaded(searchType: "point_type", logs:logs, lastEvent: event, currentIndex: 0);
    }
    else if(event is SearchNext){
      yield HistoryPageLoading(searchType:state.searchType, logs:state.logs, lastEvent: state.lastEvent);
      List<PointLog> logs;
      SearchEvent lastEvent = state.lastEvent;
      if(lastEvent is SearchRecent){
        logs = await _historyRepository.getRecentHistory(date:lastEvent.date, startAt: state.logs[state.logs.length - 1].dateSubmitted);
      }
      else if(lastEvent is SearchUser){
        logs = await _historyRepository.getUserHistory(lastEvent.userLastName, startAt: state.logs[state.logs.length - 1].dateSubmitted);
      }
      else if(lastEvent is SearchPointType){
        logs = await _historyRepository.getPointTypeHistory(lastEvent.pointType, startAt: state.logs[state.logs.length - 1].dateSubmitted);
      }
      state.logs.addAll(logs);
      yield HistoryPageLoaded(searchType: state.lastEvent.searchType, logs:state.logs, lastEvent: state.lastEvent);
    }

  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}