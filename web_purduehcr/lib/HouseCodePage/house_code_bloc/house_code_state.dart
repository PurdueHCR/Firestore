import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/HouseCode.dart';

abstract class HouseCodeState extends Equatable{
  final List<HouseCode> houseCodes;
  const HouseCodeState({this.houseCodes});
  @override
  List<Object> get props => [];
}

class HouseCodePageLoaded extends HouseCodeState {
  const HouseCodePageLoaded(List<HouseCode> houseCodes):super(houseCodes:houseCodes);
  @override
  List<Object> get props => [UniqueKey()];
}

class HouseCodePageLoading extends HouseCodeState {
  const HouseCodePageLoading();
  @override
  List<Object> get props => [];
}

class RefreshingHouseCodes extends HouseCodeState {
  const RefreshingHouseCodes();
  @override
  List<Object> get props => [];
}

class HouseCodeLoadingError extends HouseCodeState {
  const HouseCodeLoadingError();
  @override
  List<Object> get props => [];
}