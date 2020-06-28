import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Config.dart';
import 'link.dart';


class LinkBloc extends Bloc<LinkEvent, LinkState>{
  LinkRepository _linkRepository;
  final Config config;

  LinkBloc({ @required this.config})  :
        assert(config != null){
    this._linkRepository = new LinkRepository(config);
  }

  @override
  LinkState get initialState => LinkInitial([]);

  @override
  Stream<LinkState> mapEventToState( LinkEvent event) async* {
    if(event is LinkInitialize){
      yield LinkInitial([]);
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}