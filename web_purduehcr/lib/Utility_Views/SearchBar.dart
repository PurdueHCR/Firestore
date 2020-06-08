import 'package:flutter/material.dart';

class SearchBar extends StatefulWidget{
  final Function(String value) onValueChanged;

  SearchBar({@required this.onValueChanged}):assert(onValueChanged != null);

  @override
  State<StatefulWidget> createState() {
   return _SearchBarState();
  }

}

class _SearchBarState extends State<SearchBar>{
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(
          color: Colors.black,
        ),
      ),
      child: Row(
        children: [
          Flexible(
            child: TextField(
              cursorColor: Colors.black,
              decoration: new InputDecoration(
                  border: InputBorder.none,
                  focusedBorder: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  errorBorder: InputBorder.none,
                  disabledBorder: InputBorder.none,
                  contentPadding:
                  EdgeInsets.only(left: 15, bottom: 11, top: 11, right: 15),
                  hintText: "Search"
              ),
              onChanged: widget.onValueChanged,
            ),
          ),
        ],
      ),
    );
  }

}