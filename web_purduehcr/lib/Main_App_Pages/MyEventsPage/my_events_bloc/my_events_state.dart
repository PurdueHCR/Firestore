import 'package:equatable/equatable.dart';
import 'package:flutter/cupertino.dart';
import 'package:purduehcr_web/Models/Event.dart';

abstract class MyEventsState extends Equatable{
  final List<Event> myEvents;
  const MyEventsState({this.myEvents});
  @override
  List<Object> get props => [this.myEvents];
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

class MyEventsPageCreateEventError extends MyEventsState {
  const MyEventsPageCreateEventError(List<Event> myEvents): super(myEvents:myEvents);

  @override
  List<Object> get props => [UniqueKey()];
}

class EventCreationSuccess extends MyEventsState {
  const EventCreationSuccess(List<Event> myEvents): super(myEvents:myEvents);
  @override
  List<Object> get props => [UniqueKey()];
}

class EventUpdateSuccess extends MyEventsState {
  const EventUpdateSuccess(List<Event> myEvents): super(myEvents:myEvents);
  @override
  List<Object> get props => [UniqueKey()];
}

class EventUpdateError extends MyEventsState {
  const EventUpdateError(List<Event> myEvents): super(myEvents:myEvents);
  @override
  List<Object> get props => [UniqueKey()];
}

class EventDeleteSuccess extends MyEventsState {
  const EventDeleteSuccess(List<Event> myEvents): super(myEvents:myEvents);
  @override
  List<Object> get props => [UniqueKey()];
}

class EventDeleteError extends MyEventsState {
  const EventDeleteError(List<Event> myEvents): super(myEvents:myEvents);
  @override
  List<Object> get props => [UniqueKey()];
}