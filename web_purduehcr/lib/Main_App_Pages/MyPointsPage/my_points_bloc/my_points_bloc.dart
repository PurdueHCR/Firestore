
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:bloc/bloc.dart';
import 'package:purduehcr_web/Models/PointLog.dart';
import 'package:purduehcr_web/Main_App_Pages/MyPointsPage/my_points_bloc/my_points.dart';

class MyPointsBloc extends Bloc<MyPointsEvent, MyPointsState>{
  final Config config;
  MyPointsRepository _myPointsRepository;
  MyPointsBloc(this.config) : super(null){
    this._myPointsRepository = MyPointsRepository(this.config);
  }

  @override
  MyPointsState get initialState => MyPointsPageLoading();

  @override
  Stream<MyPointsState> mapEventToState( MyPointsEvent event) async* {
    if(event is MyPointsPageInitialize){
      try{
        List<PointLog> pointLog = await _myPointsRepository.getMyPoints();
        yield MyPointsPageLoaded(pointLogs: pointLog);
      }
      catch(error){
        print("There was an error loading the points : $error");
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}