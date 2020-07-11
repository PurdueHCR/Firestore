import 'dart:html';

import 'package:purduehcr_web/Config.dart';
import 'package:bloc/bloc.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/HandlePointsPage/handle_points_bloc/handle_points.dart';

class HandlePointsBloc extends Bloc<HandlePointEvent, HandlePointsState>{
  final Config config;
  HandlePointRepository _handlePointRepository;
  HandlePointsBloc(this.config){
    this._handlePointRepository = HandlePointRepository(this.config);
  }

  @override
  HandlePointsState get initialState => HandlePointsPageLoading();

  @override
  Stream<HandlePointsState> mapEventToState( HandlePointEvent event) async* {
    if(event is HandlePointEventInitialize){
      try{
        List<PointLog> pointLog = await _handlePointRepository.getUnhandledPoints();
        yield ReadyToHandlePoint(pointLogs: pointLog);
      }
      catch(error){
        window.console.log("There was an error loading the point types: $error");
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}