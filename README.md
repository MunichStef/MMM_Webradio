# MMM_Webradio
MagicMirror² module for playing webradio

### Screenshots

![Screenshot_Paused](https://github.com/MunichStef/MMM_Webradio/blob/master/Screenshots/Paused.png)
![Screenshot_Volume15](https://github.com/MunichStef/MMM_Webradio/blob/master/Screenshots/Volume15.png)
![Screenshot_Volume50](https://github.com/MunichStef/MMM_Webradio/blob/master/Screenshots/Volume50.png)
![Screenshot_Volume95](https://github.com/MunichStef/MMM_Webradio/blob/master/Screenshots/Volume95.png)

### Installation
This module just needs you to clone the latest version from github. It is straight forward:
```
$ cd MagicMirror/modules
$ git clone https://github.com/MunichStef/MMM_Webradio.git
```

Then add the following to MagicMirror/config/config.js and optionally configure any options below.
``` 
{
  module: "MMM_Webradio",
  header: "Webradio",
  position: "bottom_right",
  config: {
    startindex: 0,
    initialVolume: 50,
    streams: [
      {
        text: "Capital South Coast",
        url: "http://media-ice.musicradio.com/CapitalSouthCoastMP3"
      },
      {
        text: "RT1 in the Mix",
        url: "http://mp3.hitradiort1.c.nmdn.net/rt1inthemixwl/livestream.mp3"
      },
      {
        text: "Gong 96.3",
        url: "http://mp3.radiogong963.c.nmdn.net/ps-radiogong963/livestream.mp3"
      },
      {
        text: "RT1 90s",
        url: "http://mp3.hitradiort1.c.nmdn.net/rt190swl/livestream.mp3"
      }]
  }
},

```

### Configuration
| Option          | Description |
| -------------   | ------------- |
| startindex      | Index of the stream with witch playback will be started. |
| initialVolume   | Initial volume in % (100% is full volume, 0% is muted).  |
| streams         | Array of radio stations that can be played by the player.  |
| streams[i].text | Name of the station and text to be displayed when station is playing. |
| streams[i].url  | URL of the stream (needs to be MP3 format currently).  |


### How to control
you need another module that sends notifications in order to control this module. I am using [MMM-buttons](https://github.com/Jopyth/MMM-Buttons) for my Magic Mirror.

It does not matter which module sends the notification. The important bit is, that the notifications sent are:

| Notification      | Description |
| -------------     | ------------- |
| WEBRADIO_ONOFF    | Starts / Pauses playback |
| WEBRADIO_VOLUP    | Volume up by 5% |
| WEBRADIO_VOLDOWN  | Volume down by 5% |
| WEBRADIO_NEXT     | Next station |
| WEBRADIO_PREV     | Previous station |

### Libraries Used:
- [jPlayer](jplayer.org/)
- [JQuery](https://jquery.org/) 
