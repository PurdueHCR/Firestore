import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/HouseCode.dart';

abstract class HouseCodeEvent extends Equatable {
  const HouseCodeEvent();
}

class HouseCodeInitialize extends HouseCodeEvent {
  const HouseCodeInitialize();
  @override
  List<Object> get props => [];
}

class RefreshAllCodes extends HouseCodeEvent {
  const RefreshAllCodes();
  @override
  List<Object> get props => [];
}

class RefreshCode extends HouseCodeEvent {
  final HouseCode code;
  const RefreshCode(this.code);
  @override
  List<Object> get props => [];
}

class HouseCodeHandledMessage extends HouseCodeEvent {
  const HouseCodeHandledMessage();
  @override
  List<Object> get props => [];
}

