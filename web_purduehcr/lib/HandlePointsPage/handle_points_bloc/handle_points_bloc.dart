
import 'package:purduehcr_web/Config.dart';
import 'package:bloc/bloc.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Models/PointLogMessage.dart';
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
        yield HandlePointsPageLoaded(pointLogs: pointLog);
      }
      catch(error){
        print("There was an error loading the point types: $error");
        yield HandlePointsPageHasError(pointLogs: state.pointLogs);
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}