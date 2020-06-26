import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

abstract class UserCreationEvent extends Equatable {
  const UserCreationEvent();
}

class UserCreationPageInitialize extends UserCreationEvent {
  const UserCreationPageInitialize();
  @override
  List<Object> get props => [];
}