import 'package:equatable/equatable.dart';
import 'package:purduehcr_web/Models/PointType.dart';
import 'package:purduehcr_web/Models/PointTypePermissionLevel.dart';

abstract class PointTypeControlEvent extends Equatable {
  const PointTypeControlEvent();
}

class PointTypeControlInitialize extends PointTypeControlEvent {
  const PointTypeControlInitialize();
  @override
  List<Object> get props => [];
}

class UpdatePointType extends PointTypeControlEvent {
  final PointType pointType;
  final bool isEnabled;
  final bool residentsCanSubmit;
  final int value ;
  final PointTypePermissionLevel permissionLevel;
  final String description;
  final String name;
  const UpdatePointType(this.pointType, {this.isEnabled, this.residentsCanSubmit, this.value, this.permissionLevel, this.description, this.name});
  @override
  List<Object> get props => [pointType, description, isEnabled, residentsCanSubmit, value, permissionLevel, description, name];
}

class PointTypeControlDisplayMessage extends PointTypeControlEvent {
  const PointTypeControlDisplayMessage();
  @override
  List<Object> get props => [];
}

class CreatePointType extends PointTypeControlEvent {
  final bool isEnabled;
  final bool residentsCanSubmit;
  final int value ;
  final PointTypePermissionLevel permissionLevel;
  final String description;
  final String name;
  const CreatePointType(this.isEnabled, this.residentsCanSubmit, this.value, this.permissionLevel, this.description, this.name);
  @override
  List<Object> get props => [ description, isEnabled, residentsCanSubmit, value, permissionLevel, description, name];
}