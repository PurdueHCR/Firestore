import 'package:equatable/equatable.dart';
import 'package:purduehcr_web/Models/Link.dart';

abstract class HandleLinkState extends Equatable{
  const HandleLinkState();
}

class LinkLoaded extends HandleLinkState {
  final Link link;
  const LinkLoaded(this.link);
  @override
  List<Object> get props => [];
}

class HandleLinkLoading extends HandleLinkState {
  const HandleLinkLoading();
  @override
  List<Object> get props => [];
}

class HandleLinkError extends HandleLinkState {
  final String message;
  const HandleLinkError({this.message = ""});
  @override
  List<Object> get props => [message];
}

class SubmitLinkForPointsSuccess extends HandleLinkState {
  final String message;
  const SubmitLinkForPointsSuccess({this.message = ""});
  @override
  List<Object> get props => [message];
}