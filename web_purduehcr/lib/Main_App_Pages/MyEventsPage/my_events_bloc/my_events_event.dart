import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/Event.dart';

abstract class MyEventsEvent extends Equatable {
  const MyEventsEvent();
}

class MyEventsInitialize extends MyEventsEvent {
  const MyEventsInitialize();
  @override
  List<Object> get props => [];
}

class CreateEvent extends MyEventsEvent {
  final String name;
  final String details;
  final DateTime startDate;
  final DateTime endDate;
  final String location;
  final int pointTypeId;
  final List<String> floorIds;
  final bool isPublicEvent;
  final bool isAllFloors;
  final String host;
  final String virtualLink;
  const CreateEvent({this.name, this.details, this.startDate, this.endDate, this.location, this.pointTypeId, this.floorIds, this.isPublicEvent, this.isAllFloors, this.host, this.virtualLink});

  @override
  List<Object> get props => [UniqueKey()];
}
class EventHandledMessage extends MyEventsEvent {
  const EventHandledMessage();
  @override
  List<Object> get props => [UniqueKey()];
}

class UpdateEvent extends MyEventsEvent {
  final Event event;
  final String name;
  final String details;
  final DateTime startDate;
  final DateTime endDate;
  final String location;
  final int pointTypeId;
  final List<String> floorIds;
  final bool isPublicEvent;
  final bool isAllFloors;
  final String host;
  final String virtualLink;
  const UpdateEvent(this.event, {this.name, this.details, this.startDate, this.endDate, this.location, this.pointTypeId, this.floorIds, this.isPublicEvent, this.isAllFloors, this.host, this.virtualLink});

  @override
  List<Object> get props => [UniqueKey()];
}

class DeleteEvent extends MyEventsEvent {
  final Event event;
  const DeleteEvent({this.event});

  @override
  List<Object> get props => [UniqueKey()];
}

class DisplayCreateEventState extends MyEventsEvent {
  const DisplayCreateEventState();
  @override
  List<Object> get props => [UniqueKey()];
}