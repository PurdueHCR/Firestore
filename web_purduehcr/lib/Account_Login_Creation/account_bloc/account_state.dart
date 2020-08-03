import 'package:equatable/equatable.dart';
import 'package:flutter/cupertino.dart';

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
  List<Object> get props => [UniqueKey()];
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

class CreateAccountInitial extends AccountState {
  const CreateAccountInitial();
  @override
  List<Object> get props => [];
}

class CreateAccountError extends AccountState {
  final String message;
  const CreateAccountError({this.message = ""});
  @override
  List<Object> get props => [message];
}

class SendEmailSuccess extends AccountState {
  const SendEmailSuccess();
  @override
  List<Object> get props => [];
}

class SendEmailError extends AccountState {
  const SendEmailError();
  @override
  List<Object> get props => [];
}