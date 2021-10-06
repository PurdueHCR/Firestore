import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Models/ApiError.dart';
import 'package:purduehcr_web/Models/Link.dart';
import 'package:purduehcr_web/Authentication_Bloc/authentication.dart';
import 'handle_link.dart';


class HandleLinkBloc extends Bloc<HandleLinkEvent, HandleLinkState>{
  HandleLinkRepository _handleLinkRepository;
  AuthenticationBloc authenticationBloc;
  final Config config;

  HandleLinkBloc(this.config, this.authenticationBloc) : super(HandleLinkLoading()) {
    this._handleLinkRepository = new HandleLinkRepository(config);
  }

  // TODO: Remove?
  // @override
  // HandleLinkState get initialState => HandleLinkLoading();

  @override
  Stream<HandleLinkState> mapEventToState( HandleLinkEvent event) async* {
    if(event is HandleLinkInitialize){
      try{
        Link link = await _handleLinkRepository.getLink(event.linkId);
        yield LinkLoaded(link);
      }
      on ApiError catch(apiError){
        print("Failed. There was an error... ");
        yield HandleLinkError(message: apiError.message);
      }
      catch(error){
        print("There was an error loading the point types: "+error.toString());
        yield HandleLinkError(message: error.toString());
      }
    }
    else if(event is SubmitLinkForPoints){
      try{
        yield HandleLinkLoading();
        await _handleLinkRepository.submitLink(event.linkId);
      }
      on ApiError catch(apiError){
        if(apiError.errorCode == 201){
          yield SubmitLinkForPointsSuccess(message: "Congrats! Your point submission has been recorded and sent to your RHP for approval!");
        }
        else if(apiError.errorCode == 202){
          yield SubmitLinkForPointsSuccess(message: "Congrats! Your point submission has been recorded and you've got your points!");
          authenticationBloc.add(UpdateUser());
        }
        else if(apiError.errorCode == 407){
          yield HandleLinkError(message: "Sorry, this link is currently disabled. Talk to whoever gave you the link about enabling it.");
        }
        else if(apiError.errorCode == 408){
          yield HandleLinkError(message: "Sorry, we could not give you points for this link. We can't find it in our database. Try talking to whoever gave you this link.");
        }
        else if(apiError.errorCode == 409){
          yield HandleLinkError(message: "Sorry, you have already claimed a point for this link.");
        }
        else if(apiError.errorCode == 412){
          yield HandleLinkError(message: "Sorry, we could not give you points for this link. The competition is not currently active. Try again later.");
        }
        else if(apiError.errorCode == 418){
          yield HandleLinkError(message: "Sorry, we could not give you points for this link. The point category that this link uses is not currently active. Try again later.");
        }
        else{
          yield HandleLinkError(message: "There was a server error. Please try again.");
        }
      }
      catch(error){
        print("There was an error submitting the link: "+error.toString());
        yield HandleLinkError(message: "Uh oh. Something unexpected happened. Please try again.");
      }
    }
  }

  @override
  void onError(Object error, StackTrace stacktrace) {
    super.onError(error, stacktrace);
  }
}