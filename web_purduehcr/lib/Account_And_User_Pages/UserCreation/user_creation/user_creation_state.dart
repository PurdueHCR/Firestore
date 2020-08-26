import 'package:equatable/equatable.dart';
import 'package:purduehcr_web/Account_And_User_Pages/UserCreation/user_creation/user_creation.dart';

abstract class UserCreationState extends Equatable{
  const UserCreationState();
}

class EnterHouseCodeState extends UserCreationState {
  const EnterHouseCodeState();
  @override
  List<Object> get props => [];
}

class EnterHouseCodeStateError extends EnterHouseCodeState {
  final String message;
  const EnterHouseCodeStateError(this.message);
  @override
  List<Object> get props => [];
}

class EnterFirstAndLastNameState extends UserCreationState {
  final HouseCodePreview preview;
  const EnterFirstAndLastNameState(this.preview);
  @override
  List<Object> get props => [];
}

class EnterFirstAndLastNameStateError extends EnterFirstAndLastNameState {
  final String message;
  const EnterFirstAndLastNameStateError(HouseCodePreview preview, this.message):super(preview);
  @override
  List<Object> get props => [];
}

class LoadingUserCreationInformation extends UserCreationState {
  const LoadingUserCreationInformation();
  @override
  List<Object> get props => [];
}