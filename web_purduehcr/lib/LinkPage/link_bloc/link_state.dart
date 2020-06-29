import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';
import 'package:purduehcr_web/Models/Link.dart';
import 'package:purduehcr_web/Models/PointType.dart';

abstract class LinkState extends Equatable{
  final List<Link> links;
  const LinkState(this.links);

}

class LinkInitial extends LinkState {
  const LinkInitial() : super(null);
  @override
  List<Object> get props => [];
}

class LinkLoading extends LinkState {
  const LinkLoading(): super(null);
  @override
  List<Object> get props => [];
}

class LinkPageLoaded extends LinkState {
  const LinkPageLoaded(List<Link> links): super(links);
  @override
  List<Object> get props => [];
}

class CreateLinkError extends LinkState {
  final String message;
  final bool shouldDismissDialog;
  const CreateLinkError(List<Link> links, {this.message = "", this.shouldDismissDialog = false,}): super(links);
  @override
  List<Object> get props => [message];
}

class CreateLinkSuccess extends LinkState {
  final bool shouldDismissDialog;
  const CreateLinkSuccess({@required List<Link> links, this.shouldDismissDialog = false}):super(links);

  @override
  List<Object> get props => [];

}