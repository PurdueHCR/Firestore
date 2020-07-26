import 'package:equatable/equatable.dart';
import 'package:flutter/cupertino.dart';
import 'package:purduehcr_web/Models/Reward.dart';

abstract class RewardsState extends Equatable{
  final List<Reward> rewards;
  const RewardsState({this.rewards});
}


class RewardsPageLoading extends RewardsState {
  const RewardsPageLoading();
  @override
  List<Object> get props => [];
}

class RewardsPageLoaded extends RewardsState {
  const RewardsPageLoaded(List<Reward> rewards): super(rewards:rewards);
  @override
  List<Object> get props => [UniqueKey()];
}

class RewardsPageInitializeError extends RewardsState {
  const RewardsPageInitializeError();
  @override
  List<Object> get props => [UniqueKey()];
}

class CreateRewardsSuccess extends RewardsState {
  const CreateRewardsSuccess(List<Reward> rewards): super(rewards:rewards);
  @override
  List<Object> get props => [UniqueKey()];
}

class CreateRewardsError extends RewardsState {
  const CreateRewardsError(List<Reward> rewards): super(rewards:rewards);
  @override
  List<Object> get props => [UniqueKey()];
}

class UpdateRewardsError extends RewardsState {
  const UpdateRewardsError(List<Reward> rewards): super(rewards:rewards);
  @override
  List<Object> get props => [UniqueKey()];
}

class DeleteRewardSuccess extends RewardsState {
  const DeleteRewardSuccess(List<Reward> rewards): super(rewards:rewards);
  @override
  List<Object> get props => [UniqueKey()];
}

class DeleteRewardsError extends RewardsState {
  const DeleteRewardsError(List<Reward> rewards): super(rewards:rewards);
  @override
  List<Object> get props => [UniqueKey()];
}