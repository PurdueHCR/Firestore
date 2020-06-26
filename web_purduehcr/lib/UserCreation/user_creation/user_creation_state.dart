import 'package:equatable/equatable.dart';

abstract class UserCreationState extends Equatable{
  const UserCreationState();
}

class UserCreationPageInitial extends UserCreationState {
  const UserCreationPageInitial();
  @override
  List<Object> get props => [];
}