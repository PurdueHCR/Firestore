import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'point_type_control.dart';


class PointTypeControlBloc extends Bloc<PointTypeControlEvent, PointTypeControlState>{
  PointTypeControlRepository _pointTypeControlRepository;
  final Config config;

  PointTypeControlBloc({ @required this.config})  :
        assert(config != null){
    this._pointTypeControlRepository = new PointTypeControlRepository(config);
  }

  @override
  PointTypeControlState get initialState => PointTypeControlPageLoading();

  @override
  Stream<PointTypeControlState> mapEventToState( PointTypeControlEvent event) async* {
    if(event is PointTypeControlInitialize){
      try{
        List<PointType> types = await _pointTypeControlRepository.getPointTypes();
        types.sort((PointType a, PointType b) => a.value - b.value);
        yield PointTypeControlPageLoaded(types);
      }
      catch (error){
        print("Got error in getting point types: "+error);
        yield PointTypeInitializeError();
      }
    }
    else if(event is UpdatePointType){
      try{
        await _pointTypeControlRepository.updatePointType(event.pointType,
          isEnabled: event.isEnabled,
          residentsCanSubmit: event.residentsCanSubmit,
          value: event.value,
          permissionLevel: event.permissionLevel,
          description: event.description,
          name: event.name
        );
      }
      on ApiError catch(apiError){
        if(apiError.errorCode == 200){
          print("SUCCESS: update Point type success");
          if(event.isEnabled != null){
            event.pointType.enabled = event.isEnabled;
          }
          if(event.residentsCanSubmit != null){
            event.pointType.canResidentsSubmit = event.residentsCanSubmit;
          }
          if(event.value != null){
            event.pointType.value = event.value;
            state.pointTypes.sort((PointType a, PointType b) => a.value - b.value);
          }
          if(event.permissionLevel != null){
            event.pointType.permissionLevel = event.permissionLevel;
          }
          if(event.description != null){
            event.pointType.description = event.description;
          }
          if(event.name != null){
            event.pointType.name = event.name;
          }
          yield PointTypeControlPageLoaded(state.pointTypes);
        }
        else{
          print("Failed. There was an api rror... "+apiError.message);
          yield UpdatePointTypeError(state.pointTypes);
        }
      }
      catch(error){
        print("Failed. There was an error... "+error.toString());
        yield UpdatePointTypeError(state.pointTypes);
      }
    }
    else if(event is CreatePointType){
      try{
        PointType type = await _pointTypeControlRepository.createPointType(event.isEnabled, event.residentsCanSubmit, event.value, event.permissionLevel, event.description, event.name);
        state.pointTypes.add(type);
        state.pointTypes.sort((PointType a, PointType b) => a.value - b.value);
        yield CreatePointTypeSuccess(state.pointTypes);
      }
      on ApiError catch(apiError){
        print("Failed. There was an api rror... "+apiError.message);
        yield CreatePointTypeError(state.pointTypes);
      }
      catch (error){
        print("Got error in getting point types: "+error);
        yield CreatePointTypeError(state.pointTypes);
      }
    }
    else if(event is PointTypeControlDisplayMessage){
      yield PointTypeControlPageLoaded(state.pointTypes);
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}