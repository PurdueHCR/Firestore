import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:purduehcr_web/Utility_Views/LoadingWidget.dart';

class InitializationPage extends StatefulWidget{
  final String message;
  InitializationPage({this.message, Key key}): super(key:key);

  @override
  State<StatefulWidget> createState() {
    return _InitializationPageState();
  }

}

class _InitializationPageState extends State<InitializationPage>{

  String message;

  @override
  void initState() {
    super.initState();
    if(widget.message != null){
      message = widget.message;
    }
    else{
      message = messages[Random().nextInt(messages.length)];
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          LoadingWidget(),
          Text((widget.message == null? "Loading":"Error"),
            style: Theme.of(context).textTheme.headline3,
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Text(
              message,
              style: Theme.of(context).textTheme.headline4,
              textAlign: TextAlign.center,
              maxLines: null,
            ),
          )
        ],
      ),
    );
  }

  List<String> messages = [
    'Generating witty dialog...',
    'Swapping time and space...',
    'Spinning violently around the y-axis...',
    'Tokenizing real life...',
    'Bending the spoon...',
    'Filtering morale...',
    'Don\'t think of purple hippos...',
    'We need a new fuse...',
    'Have a good day!',
    'Upgrading Windows, your PC will restart several times. Sit back and relax.',
    '640K ought to be enough for anybody',
    'The architects are still drafting',
    'The bits are breeding',
    'We\'re building the buildings as fast as we can',
    'Would you prefer chicken, steak, or tofu?',
    '(Pay no attention to the man behind the curtain)',
    '...and enjoy the elevator music...',
    'Don\'t worry - a few bits tried to escape, but we caught them',
    'Would you like fries with that?',
    'Checking the gravitational constant in your locale...',
    'Go ahead -- hold your breath!',
    '...at least you\'re not on hold...',
    'Hum something loud while others stare',
    'You\'re not in Kansas any more',
    'The server is powered by a lemon and two electrodes.',
    'Please wait while a larger software vendor in Seattle takes over the world',
    'We\'re testing your patience',
    'Please wait. As if you had any other choice',
    'Why don\'t you order a sandwich?',
    'While the satellite moves into position',
    'The bits are flowing slowly today',
    'Dig on the \'X\' for buried treasure... ARRR!',
    'It\'s still faster than drawing it',
    'I should have had a V8 this morning.',
    'My other loading screen is much faster.',
    'Reconfoobling energymotron...',
    '(Insert quarter)',
    'Are we there yet?',
    'Just count to 10',
    'Why so serious?',
    'Counting backwards from Infinity',
    'Don\'t panic...',
    'Embiggening Prototypes',
    'Do not run! We are your friends!',
    'Do you come here often?',
    'We\'re making you a cookie.',
    'Creating a time-loop inversion field',
    'Spinning the wheel of fortune...',
    'Loading the enchanted bunny...',
    'Computing chance of success',
    'I\'m sorry Dave, I can\'t do that.',
    'Looking for exact change',
    'All your web browsers belong to us',
    'All I really need is a kilobit.',
    'I feel like im supposed to be loading something. . .',
    'What do you call 8 Hobbits? A Hobbyte.',
    'Should have used a compiled language...',
    'Is this Windows?',
    'Adjusting flux capacitor...',
    'Please wait until the sloth starts moving.',
    'Don\'t break your screen yet!',
    'I swear it\'s almost done.',
    'Let\'s take a mindfulness minute...',
    'Unicorns are at the end of this road, I promise.',
    'Keeping all the 1\'s and removing all the 0\'s...',
    'Putting the icing on the cake. The cake is not a lie...',
    'Cleaning off the cobwebs...',
    'Making sure all the i\'s have dots...',
    'We are not liable for any broken screens as a result of waiting.',
    'We need more dilithium crystals',
    'Where did all the internets go',
    'Granting wishes...',
    'Time flies when you’re having fun.',
    'Get some coffee and come back in ten minutes..',
    'Spinning the hamster…',
    'Stay awhile and listen..',
    'Load it and they will come',
    'Convincing AI not to turn evil..',
    'There is no spoon. Because we are not done loading it',
    'Your left thumb points to the right and your right thumb points to the left.',
    'How did you get here?',
    'Wait, do you smell something burning?',
    'Computing the secret to life, the universe, and everything.',
    'When nothing is going right, go left!!...',
    'I love my job only when I\'m on vacation...',
    'i\'m not lazy, I\'m just relaxed!!',
    'Why are they called apartments if they are all stuck together?',
    'Life is Short – Talk Fast!!!!',
    'Optimism – is a lack of information.....',
    'I’ve got a problem for your solution…..',
    'I think I am, therefore, I am. I think.',
    'May the forks be with you',
    'Constructing additional pylons...',
    'If you type Google into Google you can break the internet',
    'Well, this is embarrassing.',
    'What is the airspeed velocity of an unladen swallow?',
    'Hello, IT... Have you tried forcing an unexpected reboot?',
    'The Elders of the Internet would never stand for it.',
    'Space is invisible mind dust, and stars are but wishes.',
    'Didn\'t know paint dried so quickly.',
    'Dividing by zero...',
    'If I’m not back in five minutes, just wait longer.',
    'Some days, you just can’t get rid of a bug!',
    'We’re going to need a bigger boat.',
    'Cracking military-grade encryption...',
    'Simulating traveling salesman...',
    'Proving P = NP...',
    'Entangling superstrings...',
    'Twiddling thumbs...',
    'Searching for plot device...',
    'Trying to sort in O(n)...',
    'Laughing at your pictures... i mean, loading...',
    'Sending data to the NS... i mean, our servers.',
    'Looking for a sense of humour, please hold on.',
    'Please wait while the intern refills my coffee.',
    'Please hold on as we reheat our coffee',
    'Kindly hold on as we convert this bug to a feature...',
    'Winter is coming...',
    'Distracted by cat gifs',
    '@todo Insert witty loading message',
    'Let\'s hope it\'s worth the wait',
    'Aw, snap! Not..',
    'Ordering 1s and 0s...',
    'Updating dependencies...',
    'Whatever you do, don\'t look behind you...',
    'Please wait... Consulting the manual...',
    'Loading funny message...',
    'Feel free to spin in your chair',
    'What the what?',
    'format C: ...',
    'You wouldn\'t happen to know my password, would you?',
    'What\'s under there?',
    'Go ahead, you may do push ups until the loading is complete',
    'Bored of a slow loading spinner, buy more RAM!',
    'Help, I\'m trapped in a loader!',
    'Updating to Windows Vista...',
    'Alt-F4 speeds things up. (Just kidding, it doesn\'t. Please don\'t do this if you care about your tabs)',
    'Initializing the initializer...',
    'When was the last time you dusted around here?',
    'Optimizing the optimizer...',
    'Never let a computer know you\'re in a hurry.',
    'A computer will do what you tell it to do, but that may be much different from what you had in mind.',
    'Some things people were never meant to know. For everything else, there\'s Google.',
    'Unix is user-friendly. It\'s just very selective about who its friends are.',
    'Shovelling coal into the server',
    'Pushing pixels...',
    'How about this weather, eh?',
    'Everything in this universe is either a potato or not a potato',
    'Updating Updater...',
    'Downloading Downloader...',
    'Reading Terms and Conditions for you.',
    'Digested cookies being baked again.',
    'Live long and prosper.',
    'Running with scissors...',
    'Definitely not a virus...',
    'You seem like a nice person...',
    'Work, work...',
    'Patience! This is difficult, you know...',
    'Discovering new ways of making you wait...',
    'Your time is very important to us. Please wait while we ignore you...',
    'Time flies like an arrow; fruit flies like a banana',
    'Two men walked into a bar; the third ducked...',
    'Sorry we are busy catching em\' all, we\'ll be done soon',
    'TODO: Insert elevator music',
    'Still faster than Windows update',
    'What, were you expecting a cute animal video compilation?'
  ];

}
