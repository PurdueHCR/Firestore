import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:purduehcr_web/Models/PointType.dart';

abstract class HistoryEvent extends Equatable {

  const HistoryEvent();
}

class SelectSearchType extends HistoryEvent {
  final String searchType;
  const SelectSearchType({@required this.searchType});
  @override
  List<Object> get props => [searchType];
}

class SelectHouse extends HistoryEvent {
  final String house;
  const SelectHouse({@required this.house});
  @override
  List<Object> get props => [house];
}

class SearchEvent extends HistoryEvent {
  final String searchType;
  const SearchEvent({@required this.searchType});

  @override
  List<Object> get props => [searchType];
}

class SearchRecent extends SearchEvent {
  final DateTime date;

  const SearchRecent({@required this.date}): super(searchType: "recent");
  @override
  List<Object> get props => [];
}

class SearchUser extends SearchEvent {
  final String userLastName;
  const SearchUser({@required this.userLastName}): super(searchType: "recent");
  @override
  List<Object> get props => [];
}

class SearchPointType extends SearchEvent {
  final PointType pointType;
  const SearchPointType({@required this.pointType}): super(searchType: "point_type");
  @override
  List<Object> get props => [];
}

class SearchNext extends HistoryEvent {
  const SearchNext();

  @override
  List<Object> get props => [];
}
