import 'package:equatable/equatable.dart';
import 'package:purduehcr_web/Models/Link.dart';

abstract class LinkState extends Equatable{
  final List<Link> links;
  const LinkState(this.links);

}

class LinkInitial extends LinkState {
  const LinkInitial(List<Link> links): super(links);
  @override
  List<Object> get props => [];
}

class LinkLoading extends LinkState {
  const LinkLoading(List<Link> links): super(links);
  @override
  List<Object> get props => [];
}

class LinkError extends LinkState {
  final String message;
  const LinkError({this.message = "", List<Link> links}): super(links);
  @override
  List<Object> get props => [message];
}