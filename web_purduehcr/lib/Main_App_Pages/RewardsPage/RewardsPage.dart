import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:purduehcr_web/Configuration/Config.dart';
import 'package:purduehcr_web/Configuration/ConfigWrapper.dart';
import 'package:purduehcr_web/Models/Reward.dart';
import 'package:purduehcr_web/Models/UserPermissionLevel.dart';
import 'package:purduehcr_web/Utility_Views/BasePage.dart';
import 'package:purduehcr_web/Main_App_Pages/RewardsPage/EditRewardForm.dart';
import 'package:purduehcr_web/Main_App_Pages/RewardsPage/RewardCreationForm.dart';
import 'package:purduehcr_web/Main_App_Pages/RewardsPage/rewards_bloc/rewards.dart';
import 'package:purduehcr_web/Utilities/DisplayTypeUtil.dart';
import 'package:purduehcr_web/Utility_Views/RewardsList.dart';

class RewardsPage extends BasePage {
  RewardsPage({Key key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _RewardsPageState("Rewards");
  }
}

class _RewardsPageState
    extends BasePageState<RewardsBloc, RewardsEvent, RewardsState> {
  _RewardsPageState(String drawerLabel) : super(drawerLabel);

  RewardsBloc _rewardsBloc;
  Reward _selectedReward;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_rewardsBloc == null) {
      Config config = ConfigWrapper.of(context);
      _rewardsBloc = new RewardsBloc(config: config);
      _rewardsBloc.add(RewardsInitialize());
    }
  }

  @override
  Widget buildLargeDesktopBody({BuildContext context, RewardsState state}) {
    _handleSnackChatState(context, state);
    if (state is RewardsPageInitializeError) {
      return Center(child: Text("There was an error loading the rewards."));
    } else {
      return Row(
        children: [
          Flexible(
            child: RewardList(
              rewards: state.rewards,
              onPressed: (context, reward) {
                setState(() {
                  _selectedReward = reward;
                });
              },
            ),
          ),
          Flexible(
            child: SingleChildScrollView(
              child: BlocProvider(
                builder: (BuildContext context) => _rewardsBloc,
                child: EditRewardForm(
                  key: ObjectKey(_selectedReward),
                  reward: _selectedReward,
                ),
              ),
            )
          )
        ],
      );
    }
  }

  @override
  Widget buildSmallDesktopBody({BuildContext context, RewardsState state}) {
    return _buildSmallBody(context, state);
  }

  @override
  Widget buildMobileBody({BuildContext context, RewardsState state}) {
    return _buildSmallBody(context, state);
  }

  Widget _buildSmallBody(BuildContext context, RewardsState state) {
    _handleSnackChatState(context, state);
    if (state is RewardsPageInitializeError) {
      return Center(child: Text("There was an error loading the rewards."));
    } else {
      if (_selectedReward == null) {
        return RewardList(
          rewards: state.rewards,
          onPressed: (context, reward) {
            setState(() {
              _selectedReward = reward;
            });
          },
        );
      } else {
        return SingleChildScrollView(
          child: BlocProvider(
            builder: (BuildContext context) => _rewardsBloc,
            child: EditRewardForm(
              key: ObjectKey(_selectedReward),
              reward: _selectedReward,
            ),
          ),
        );
      }
    }
  }

  @override
  FloatingActionButton buildFloatingActionButton(BuildContext context) {
    return FloatingActionButton(
      child: Icon(Icons.add),
      onPressed: () => _createRewardButton(context),
    );
  }

  _createRewardButton(BuildContext context) {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return SimpleDialog(
            title: Text("Create New Reward"),
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.all(Radius.circular(10.0))),
            children: [
              SizedBox(
                  width: getOptimalDialogWidth(context),
                  child: BlocProvider(
                      builder: (BuildContext context) => _rewardsBloc,
                      child: RewardCreationForm()))
            ],
          );
        });
  }

  @override
  RewardsBloc getBloc() {
    return _rewardsBloc;
  }

  @override
  bool isLoadingState(currentState) {
    return currentState is RewardsPageLoading;
  }

  @override
  UserPermissionSet getAcceptedPermissionLevels() {
    return UserPermissionSet([UserPermissionLevel.PROFESSIONAL_STAFF].toSet());
  }

  _handleSnackChatState(BuildContext context, RewardsState state) {
    if (state is CreateRewardsSuccess) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.of(context).pop();
      });
      final snackBar = SnackBar(
        backgroundColor: Colors.green,
        content: Text('The reward has been created!'),
      );
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Scaffold.of(context).showSnackBar(snackBar);
        _rewardsBloc.add(RewardHandleMessage());
      });
    }
    else if (state is CreateRewardsError) {
      final snackBar = SnackBar(
        backgroundColor: Colors.red,
        content:
            Text('There was an error creating the reward. Please try again.'),
      );
      WidgetsBinding.instance.addPostFrameCallback((_) {

        Scaffold.of(context).showSnackBar(snackBar);
        _rewardsBloc.add(RewardHandleMessage());
      });
    }
    else if (state is UpdateRewardsError) {
      final snackBar = SnackBar(
        backgroundColor: Colors.red,
        content:
            Text('There was an error updating the reward. Please try again.'),
      );
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Scaffold.of(context).showSnackBar(snackBar);
        _rewardsBloc.add(RewardHandleMessage());
      });
    }
    else if (state is DeleteRewardSuccess) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.of(context).pop();
      });
      final snackBar = SnackBar(
        backgroundColor: Colors.green,
        content:
        Text('The reward was successfully deleted'),
      );
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Scaffold.of(context).showSnackBar(snackBar);
        _selectedReward = null;
        _rewardsBloc.add(RewardHandleMessage());
      });
    }
    else if (state is DeleteRewardsError) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.of(context).pop();
      });
      final snackBar = SnackBar(
        backgroundColor: Colors.red,
        content:
            Text('There was an error deleting the reward. Please try again.'),
      );
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Scaffold.of(context).showSnackBar(snackBar);
        _rewardsBloc.add(RewardHandleMessage());
      });
    }
  }

  @override
  Widget buildLeadingButton(DisplayType displayType) {
    if (_selectedReward == null || displayType == DisplayType.desktop_large) {
      return null;
    } else {
      return IconButton(
        icon: Icon(Icons.arrow_back),
        onPressed: () {
          setState(() {
            _selectedReward = null;
          });
        },
      );
    }
  }

  @override
  void dispose() {
    super.dispose();
    _rewardsBloc.close();
  }
}
