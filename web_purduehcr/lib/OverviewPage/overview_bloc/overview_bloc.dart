import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:purduehcr_web/Config.dart';
import 'package:purduehcr_web/OverviewPage/overview_bloc/overview_repository.dart';
import 'overview.dart';
class OverviewBloc extends Bloc<OverviewEvent, OverviewState>{
  final Config config;
  OverviewRepository overviewRepository;
  OverviewBloc(this.config){
    this.overviewRepository = OverviewRepository(this.config);
  }

  @override
  OverviewState get initialState => OverviewLoading();

  @override
  Stream<OverviewState> mapEventToState( OverviewEvent event) async* {
    if(event is OverviewLaunchedEvent){
      try{
        yield await overviewRepository.getUserOverview(event.permissionLevel);
      }
      catch(error){
        yield OverviewError(error: error);
      }
    }
    else if(event is ReloadOverview){
      try{
        yield OverviewLoading();
        yield await overviewRepository.getUserOverview(event.permissionLevel);
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