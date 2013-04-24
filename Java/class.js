// script class
//
// copyright 1997-2013. P.B. Stark, statistics.berkeley.edu/~stark
// Version 1.0
// All rights reserved.

// !!!!Beginning of the code!!!!

var classModTime = '2008/4/21/2350';
                                   // modification date and time
var today = (new Date()).toLocaleString();
defaultLinkList = [  ['Home','index.htm'],
                     ['Assignments','assign.htm'],
                     ['Description','desc.htm'],
                     ['Notes','Notes/index.htm'],
                  ];
var relPath; // relative path to course homepage

function classLinks(base, size, list) {
    if (typeof(size) == 'undefined' || size == null) {
            size = '+0';
    }
    if (typeof(list) == 'undefined' || list == null) {
            list = defaultLinkList;
    }
    var qStr = '<p align="center"><font size="' + size + '">|';
    for (var i=0; i < list.length; i++) {
            qStr += '&nbsp;' + (list[i][0]).link(base + list[i][1]) + '&nbsp;|';
    }
    qStr += '</font></p>';
    document.writeln(qStr);
    return(true);
}

function noteLinks(base, size, lastNote) {
    var i;
    var qStr = '<p align="center">';
    if (typeof(base) == 'undefined' || base == null) {
            base = '';
    }
    for (i=1; i <= lastNote; i+=1) {
        qStr += '&nbsp;<a href="' + base + 'ch' + i.toString() + '.htm">Set ' + i.toString() + '</a>&nbsp;';
        if ((i) % 12 == 0) {
                qStr += '</p><p align="center">';
        }
    }
    qStr += '</p>';
    document.writeln(qStr);
    return(true);
}
