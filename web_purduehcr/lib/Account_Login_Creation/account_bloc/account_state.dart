import 'package:equatable/equatable.dart';

abstract class AccountState extends Equatable{
  const AccountState();
}

class AccountInitial extends AccountState {
  const AccountInitial();
  @override
  List<Object> get props => [];
}

class AccountLoading extends AccountState {
  const AccountLoading();
  @override
  List<Object> get props => [];
}

class LoginSuccess extends AccountState {
  const LoginSuccess();
  @override
  List<Object> get props => [];
}

class AccountError extends AccountState {
  final String message;
  const AccountError({this.message = ""});
  @override
  List<Object> get props => [message];
}