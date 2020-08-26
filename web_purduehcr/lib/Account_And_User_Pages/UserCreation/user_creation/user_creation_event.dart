import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

abstract class UserCreationEvent extends Equatable {
  const UserCreationEvent();
}

class EnterHouseCode extends UserCreationEvent {
  final String houseCode;
  const EnterHouseCode(this.houseCode);
  @override
  List<Object> get props => [houseCode];
}

class JoinHouse extends UserCreationEvent {
  final String houseCode;
  final String firstName;
  final String lastName;
  const JoinHouse(this.houseCode, this.firstName, this.lastName);
  @override
  List<Object> get props => [houseCode, firstName, lastName];
}

class ReturnToEnterHouseCode extends UserCreationEvent {
  @override
  List<Object> get props => [];
}