import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:purduehcr_web/OverviewPage/overview_bloc/overview_repository.dart';
import 'overview.dart';
class OverviewBloc extends Bloc<OverviewEvent, OverviewState>{
  OverviewRepository overviewRepository = new OverviewRepository();
  OverviewBloc();

  @override
  OverviewState get initialState => OverviewInitial();

  @override
  Stream<OverviewState> mapEventToState( OverviewEvent event) async* {
    if(event is OverviewLaunchedEvent){
      yield OverviewLoading();
      try{
        yield await overviewRepository.getUserOverview(event.permissionLevel, event.token);
      }
      catch(error){
        yield OverviewError(error: error);
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}