import 'package:equatable/equatable.dart';

abstract class ULCState extends Equatable{
  const ULCState();
}

class ULCInitial extends ULCState {
  const ULCInitial();
  @override
  List<Object> get props => [];
}

class ULCLoading extends ULCState {
  const ULCLoading();
  @override
  List<Object> get props => [];
}

class LoginSuccess extends ULCState {
  const LoginSuccess();
  @override
  List<Object> get props => [];
}

class ULCError extends ULCState {
  final String message;
  const ULCError({this.message = ""});
  @override
  List<Object> get props => [message];
}