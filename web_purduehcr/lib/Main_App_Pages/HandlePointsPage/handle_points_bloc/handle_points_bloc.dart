
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:bloc/bloc.dart';
import 'package:purduehcr_web/Main_App_Pages/HandlePointsPage/handle_points_bloc/handle_points.dart';
import 'package:purduehcr_web/Models/PointLog.dart';

class HandlePointsBloc extends Bloc<HandlePointEvent, HandlePointsState>{
  final Config config;
  HandlePointRepository _handlePointRepository;
  HandlePointsBloc(this.config) : super(null){
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