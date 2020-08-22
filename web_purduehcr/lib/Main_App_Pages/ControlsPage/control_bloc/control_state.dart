import 'package:equatable/equatable.dart';
import 'package:purduehcr_web/Models/SystemPreferences.dart';

abstract class ControlState extends Equatable{
  final SystemPreference settings;
  const ControlState({this.settings});
}

class ControlLoaded extends ControlState {

  const ControlLoaded(SystemPreference settings): super(settings:settings);
  @override
  List<Object> get props => [];
}

class ControlPageLoading extends ControlState {
  const ControlPageLoading(): super();
  @override
  List<Object> get props => [];
}

class ControlInitializeError extends ControlState {
  const ControlInitializeError():super();
  @override
  List<Object> get props => [];
}

class ControlUpdateError extends ControlState {
  const ControlUpdateError(SystemPreference settings):super(settings:settings);
  @override
  List<Object> get props => [];
}

class ControlEmailError extends ControlState {
  final String message;
  const ControlEmailError(this.message, SystemPreference settings):super(settings:settings);
  @override
  List<Object> get props => [];
}

class ControlEmailSent extends ControlState {
  const ControlEmailSent( SystemPreference settings):super(settings:settings);
  @override
  List<Object> get props => [];
}