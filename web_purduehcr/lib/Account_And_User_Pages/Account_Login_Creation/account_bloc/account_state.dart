import 'package:equatable/equatable.dart';
import 'package:flutter/cupertino.dart';

abstract class AccountState{
  const AccountState();
}

class AccountInitial extends AccountState {
  const AccountInitial();

}

class AccountPageLoading extends AccountState {
  const AccountPageLoading();

}

class LoginSuccess extends AccountState {
  const LoginSuccess();

}

class AccountError extends AccountState {
  final String message;
  const AccountError({this.message = ""});

}

class CreateAccountInitial extends AccountState {
  const CreateAccountInitial();

}

class CreateAccountError extends AccountState {
  final String message;
  const CreateAccountError({this.message = ""});

}

class SendEmailSuccess extends AccountState {
  const SendEmailSuccess();

}

class SendEmailError extends AccountState {
  const SendEmailError();

}