
import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';
import 'package:purduehcr_web/Models/Link.dart';

abstract class LinkState extends Equatable{
  final List<Link> links;
  const LinkState({this.links});

}

class LinkInitial extends LinkState {
  const LinkInitial() : super();
  @override
  List<Object> get props => [];
}

class LinkLoading extends LinkState {
  const LinkLoading(): super();
  @override
  List<Object> get props => [];
}

class LinkPageLoaded extends LinkState {
  const LinkPageLoaded(List<Link> links): super(links:links);
  @override
  List<Object> get props => [];
}

class LoadLinksError extends LinkState {
  const LoadLinksError(): super();
  @override
  List<Object> get props => [];
}

class CreateLinkError extends LinkState {
  const CreateLinkError(List<Link> links): super(links:links);
  @override
  List<Object> get props => [];
}

class UpdateLinkError extends LinkState {
  final Link originalLink;
  const UpdateLinkError(List<Link> links, this.originalLink): super(links:links);
  @override
  List<Object> get props => [originalLink];
}

class UpdateLinkSuccess extends LinkState {
  final Link originalLink;
  final String description;
  final bool enabled;
  final bool singleUse;
  final bool archived;
  const UpdateLinkSuccess(List<Link> links, this.originalLink, {this.description, this.enabled, this.singleUse, this.archived}): super(links:links);
  @override
  List<Object> get props => [originalLink, description, enabled, singleUse, archived];
}

class LinkSuccess extends LinkState {
  const LinkSuccess({@required List<Link> links}):super(links:links);

  @override
  List<Object> get props => [links];
}

class CreateLinkSuccess extends LinkState {

  const CreateLinkSuccess({@required List<Link> links}):super(links:links);

  @override
  List<Object> get props => [links];
}