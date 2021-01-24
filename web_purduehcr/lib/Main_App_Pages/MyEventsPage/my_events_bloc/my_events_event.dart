import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

abstract class MyEventsEvent extends Equatable {
  const MyEventsEvent();
}

class MyEventsInitialize extends MyEventsEvent {
  const MyEventsInitialize();
  @override
  List<Object> get props => [];
}

