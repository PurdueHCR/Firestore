import 'dart:html';

import 'package:purduehcr_web/Config.dart';
import 'package:bloc/bloc.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/SubmitPointsPage/submit_points_bloc/submit_points.dart';

class SubmitPointBloc extends Bloc<SubmitPointEvent, SubmitPointState>{
  final Config config;
  SubmitPointRepository _submitPointRepository;
  List<PointType> pointTypes;
  SubmitPointBloc(this.config){
    this._submitPointRepository = SubmitPointRepository(this.config);
  }

  @override
  SubmitPointState get initialState => SubmitPointPageLoading();

  @override
  Stream<SubmitPointState> mapEventToState( SubmitPointEvent event) async* {
    if(event is SubmitPointInitialize){
      try{
        pointTypes = await _submitPointRepository.getPointTypes();
         yield ReadyForSubmission(pointTypes: pointTypes);
      }
      catch(error){
        window.console.log("There was an error loading the point types: "+error.toString());
      }
    }
    else if(event is SubmitPoint){
      yield SubmissionProcessing();
      try{
        await _submitPointRepository.submitPoint(event.description, event.dateOccurred, event.pointTypeId);
        yield ReadyForSubmission(pointTypes: pointTypes, successMessage: "Submission Accepted");
      }
      catch(error){
        window.console.log("There was an error loading the point types: "+error.toString());
        yield SubmitPointError(error: error);
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}