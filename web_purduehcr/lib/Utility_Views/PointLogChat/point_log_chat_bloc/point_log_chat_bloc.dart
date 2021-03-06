import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/PointLogMessage.dart';
import './point_log_chat.dart';


class PointLogChatBloc extends Bloc<PointLogChatEvent, PointLogChatState>{
  PointLogChatRepository _pointLogChatRepository;
  final String house; // Included if the account is professional staff, so they can see messages
  final Config config;

  PointLogChatBloc({ @required this.config , this.house})  :
        assert(config != null){
    this._pointLogChatRepository = new PointLogChatRepository(config);
  }

  @override
  PointLogChatState get initialState => PointLogChatLoading();

  @override
  Stream<PointLogChatState> mapEventToState( PointLogChatEvent event) async* {
    if(event is PointLogChatInitialize){
      try{
        List<PointLogMessage> messages = await _pointLogChatRepository.getMessages(event.pointLog, house: house);
        yield PointLogChatLoaded(messages: messages, pointLog: event.pointLog);
      }
      catch(error){
        print("Got error: "+error);
      }
    }
    else if(event is PostMessage){
      List<PointLogMessage> messages = (state as PointLogChatLoaded).messages;
      PointLog log = (state as PointLogChatLoaded).pointLog;
      if(event.message.message.isNotEmpty){
        messages.add(event.message);
        yield PointLogChatLoaded(messages: messages, pointLog: log);
        try{
          await _pointLogChatRepository.postMessage(log, event.message.message, house: house);
        }
        on ApiError catch(apiError){
          if(apiError.errorCode != 200){
            print("Got api error: "+apiError.toString());
            messages.removeLast();
            yield PointLogChatLoaded(messages: messages, pointLog: log);
          }
        }
        catch(error){
          print("Got error: "+error);
          messages.removeLast();
          yield PointLogChatLoaded(messages: messages, pointLog: log);
        }
      }
      else{
        yield PointLogChatLoaded(messages: messages, pointLog: log);
      }
    }
    else if(event is ApprovePointLog){
      List<PointLogMessage> messages = (state as PointLogChatLoaded).messages;
      PointLog log = (state as PointLogChatLoaded).pointLog;
      messages.add(PointLogMessage.createApproveMessage(event.user));
      log.approve();
      yield PointLogChatLoaded(messages: messages, pointLog: log);

      try{
        await _pointLogChatRepository.handlePointLog(log, true);
      }
      catch(error){
        yield PointLogChatLoaded(messages: messages, pointLog: log);
      }
    }
    else if(event is RejectPointLog){
      List<PointLogMessage> messages = (state as PointLogChatLoaded).messages;
      PointLog log = (state as PointLogChatLoaded).pointLog;
      messages.add(PointLogMessage.createRejectionMessage(event.user, event.message.message));
      log.reject();
      yield PointLogChatLoaded(messages: messages, pointLog: log);
      try{
        await _pointLogChatRepository.handlePointLog(log, false, message: event.message.message);
      }
      catch(error){
        yield PointLogChatLoaded(messages: messages, pointLog: log);
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}