import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/HouseCode.dart';
import 'house_code.dart';


class HouseCodeBloc extends Bloc<HouseCodeEvent, HouseCodeState>{
  HouseCodeRepository _houseCodeRepository;
  final Config config;

  HouseCodeBloc({ @required this.config})  :
        assert(config != null), super(HouseCodePageLoading()) {
    this._houseCodeRepository = new HouseCodeRepository(config);
  }

  // TODO: Remove?
  // @override
  // HouseCodeState get initialState => HouseCodePageLoading();

  @override
  Stream<HouseCodeState> mapEventToState( HouseCodeEvent event) async* {
    if(event is HouseCodeHandledMessage){
      yield HouseCodePageLoaded(state.houseCodes);
    }
    else if(event is HouseCodeInitialize){
      try{
        List<HouseCode> codes = await _houseCodeRepository.getHouseCodes();
        yield HouseCodePageLoaded(codes);
      }
      catch(error){
        print("Error initializing house codes: "+error.toString());
        yield HouseCodeLoadingError();
      }
    }
    else if(event is RefreshAllCodes){
      try{
        yield RefreshingHouseCodes();
        List<HouseCode> codes = await _houseCodeRepository.refreshHouseCodes();
        yield HouseCodePageLoaded(codes);
      }
      catch(error){
        print("Error refreshing house codes: "+error.toString());
        yield ErrorRefreshingHouseCodes();
      }
    }
    else if(event is RefreshCode){
      try{
        yield HouseCodePageLoaded(state.houseCodes);
        await _houseCodeRepository.refreshHouseCode(event.code);
        print("Done refreshing.");
        yield HouseCodePageLoaded(state.houseCodes);
      }
      catch(error){
        print("Error refreshing house codes: "+error.toString());
        yield ErrorRefreshingHouseCodes();
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}