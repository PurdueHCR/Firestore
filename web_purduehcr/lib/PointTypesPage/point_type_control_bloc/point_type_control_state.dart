import 'package:equatable/equatable.dart';
import 'package:flutter/cupertino.dart';
import 'package:purduehcr_web/Models/PointType.dart';

abstract class PointTypeControlState extends Equatable{
  final List<PointType> pointTypes;
  const PointTypeControlState({this.pointTypes});
  @override
  List<Object> get props => [pointTypes];
}

class PointTypeControlPageLoading extends PointTypeControlState {
  const PointTypeControlPageLoading();

}

class PointTypeControlPageLoaded extends PointTypeControlState {
  const PointTypeControlPageLoaded(List<PointType> pointTypes):super(pointTypes:pointTypes);
  @override
  List<Object> get props => [UniqueKey()];
}

class PointTypeInitializeError extends PointTypeControlState {
  final String message;
  const PointTypeInitializeError({this.message = "Sorry. We were unable to download the point categories. Please try again."});
  @override
  List<Object> get props => [message];
}

class UpdatePointTypeError extends PointTypeControlState {
  const UpdatePointTypeError(List<PointType> pointTypes):super(pointTypes:pointTypes);
}

class CreatePointTypeError extends PointTypeControlState {
  const CreatePointTypeError(List<PointType> pointTypes):super(pointTypes:pointTypes);
}

class CreatePointTypeSuccess extends PointTypeControlState {
  const CreatePointTypeSuccess(List<PointType> pointTypes):super(pointTypes:pointTypes);
}