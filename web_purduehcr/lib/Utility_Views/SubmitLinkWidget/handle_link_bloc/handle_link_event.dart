import 'package:equatable/equatable.dart';


abstract class HandleLinkEvent extends Equatable {
  final String linkId;
  const HandleLinkEvent(this.linkId);
  @override
  List<Object> get props => [this.linkId];
}

class HandleLinkInitialize extends HandleLinkEvent {
  const HandleLinkInitialize(String linkId):super(linkId);
}

class SubmitLinkForPoints extends HandleLinkEvent {
  const SubmitLinkForPoints(String linkId):super(linkId);
}
