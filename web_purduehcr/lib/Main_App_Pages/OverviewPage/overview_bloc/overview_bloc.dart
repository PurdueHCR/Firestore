import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Main_App_Pages/OverviewPage/overview_bloc/overview_repository.dart';
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
        print("Trying to yield");
        yield await overviewRepository.getUserOverview(event.permissionLevel);
        print("Yielded state");
      }
      catch(error){
        print("Got error from Overview Bloc: " +error.toString());
        yield OverviewError(error: error);
      }
    }
    else if(event is ReloadOverview){
      try{
        yield OverviewLoading();
        yield await overviewRepository.getUserOverview(event.permissionLevel);
      }
      catch(error){
        print("Got error from Overview Bloc: " +error.toString());
        yield OverviewError(error: error);
      }
    }

    else if(event is GrantAward){
      ProfessionalStaffLoaded currentState = state as ProfessionalStaffLoaded;
      try{
        await overviewRepository.grantHouseAward(event.house.name, event.description, event.pointsPerResident);
        yield GrantAwardError(currentState.houses);
      }
      on ApiError catch(error){
        if(error.errorCode == 200){
            event.house.totalPoints += (event.house.numberOfResidents * event.pointsPerResident) as int;
            event.house.pointsPerResident += event.pointsPerResident;
            yield GrantAwardSuccess(currentState.houses);
        }
        else
          yield GrantAwardError(currentState.houses);
      }
      catch(error){
        print("Got error from granting award" +error.toString());
        yield GrantAwardError(currentState.houses);
      }
    }
    else if(event is UpdateHouse){
      ProfessionalStaffLoaded currentState = state as ProfessionalStaffLoaded;
      try{
        await overviewRepository.updateHouse(event.house.name, description: event.description, numberOfResidents: event.numberOfResidents);
        yield UpdateHouseError(currentState.houses);
      }
      on ApiError catch(error){
        if(error.errorCode == 200){
          event.house.description = event.description;
          event.house.numberOfResidents = event.numberOfResidents;
          event.house.pointsPerResident = event.house.totalPoints / event.numberOfResidents;
          yield ProfessionalStaffLoaded(houses: currentState.houses);
        }
        else {
          yield UpdateHouseError(currentState.houses);
        }
      }
      catch(error){
        print("Got error from updating the house" +error.toString());
        yield UpdateHouseError(currentState.houses);
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}