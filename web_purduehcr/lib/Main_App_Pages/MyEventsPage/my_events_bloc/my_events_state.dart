import 'package:equatable/equatable.dart';
import 'package:purduehcr_web/Models/Event.dart';

abstract class MyEventsState extends Equatable{
  final List<Event> myEvents;
  const MyEventsState({this.myEvents});
}


class MyEventsPageLoading extends MyEventsState {
  const MyEventsPageLoading();
  @override
  List<Object> get props => [];
}

class MyEventsPageLoaded extends MyEventsState {
  const MyEventsPageLoaded(List<Event> myEvents): super(myEvents:myEvents);
  @override
  List<Object> get props => [];
}

class MyEventsPageInitializeError extends MyEventsState {
  const MyEventsPageInitializeError();
  @override
  List<Object> get props => [];
}