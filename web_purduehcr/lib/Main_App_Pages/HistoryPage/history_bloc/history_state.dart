import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';
import 'package:purduehcr_web/Models/PointLog.dart';

import 'history_event.dart';

abstract class HistoryState extends Equatable{
  final String searchType;
  final List<PointLog> logs;
  final SearchEvent lastEvent;
  final String house;
  const HistoryState({@required this.searchType, this.logs, this.lastEvent, this.house});
  @override
  List<Object> get props => [searchType, logs, lastEvent, house];
}

class HistoryPageLoading extends HistoryState {
  const HistoryPageLoading({List<PointLog> logs, String searchType, SearchEvent lastEvent , int currentIndex, String house}):
        super(searchType:searchType, logs:logs, lastEvent: lastEvent, house:house);
}

class HistoryPageLoaded extends HistoryState {
  const HistoryPageLoaded({List<PointLog> logs, String searchType, SearchEvent lastEvent , int currentIndex, String house}):
        super(searchType:searchType, logs:logs, lastEvent: lastEvent, house:house);
}

class HistoryPageError extends HistoryState {
  const HistoryPageError({List<PointLog> logs, String searchType, SearchEvent lastEvent , int currentIndex, String house}):
        super(searchType:searchType, logs:logs, lastEvent: lastEvent, house:house);
}
