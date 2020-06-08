import 'dart:html';

import 'package:purduehcr_web/Config.dart';
import 'package:bloc/bloc.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/SubmitPointsPage/submit_points_bloc/submit_points.dart';

class SubmitPointBloc extends Bloc<SubmitPointEvent, SubmitPointState>{
  final Config config;
  SubmitPointRepository _submitPointRepository;
  SubmitPointBloc(this.config){
    this._submitPointRepository = SubmitPointRepository(this.config);
  }

  @override
  SubmitPointState get initialState => SubmitPointPageLoading();

  @override
  Stream<SubmitPointState> mapEventToState( SubmitPointEvent event) async* {
    if(event is SubmitPointInitialize){
      try{
        List<PointType> pointTypes = await _submitPointRepository.getPointTypes();
         yield ReadyForSubmission(pointTypes: pointTypes);
      }
      catch(error){
        window.console.log("There was an error loading the point types: $error");
      }
    }
    else if(event is SubmitPoint){
      try{
        await _submitPointRepository.submitPoint(event.description, event.dateOccurred, event.pointTypeId);
      }
      on ApiError catch(apiError){
        if(apiError.errorCode == 200 || apiError.errorCode == 201){
          window.console.log("SUCCESS: yield success");
          yield SubmissionSuccess(pointTypes: state.pointTypes, shouldDismissDialog: event.shouldDismissDialog);
        }
        else{
          yield SubmissionError(pointTypes: state.pointTypes, message: apiError.message, shouldDismissDialog: event.shouldDismissDialog);
        }
      }
      catch(error){
        window.console.log("There was an error loading the point types: "+error.toString());
        yield SubmissionError(pointTypes: state.pointTypes, message: error.toString(), shouldDismissDialog: event.shouldDismissDialog);
      }
    }
    else if(event is SubmitPointDisplayedMessage){
      yield ReadyForSubmission(pointTypes: state.pointTypes);
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}