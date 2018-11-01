const VERSION = "1.0";

Module.register("MMM_Webradio", {

    defaults: {
        currentVolume: 50,
        alreadyPlaying: false,
        startIndex: 0,
        streams: [
            {
                text: "Capital South Coast",
                url: "http://media-ice.musicradio.com/CapitalSouthCoastMP3"
            }
        ]
    },

    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.setAttribute("class", "Webplayer");

        //Create Player
        var jPlayerElement = document.createElement("div");
        jPlayerElement.setAttribute("id", "jquery_jplayer_1");
        jPlayerElement.setAttribute("class", "jp-jplayer");

        //Create OSD
        var onScreenDisplay = document.createElement("div");
        onScreenDisplay.setAttribute("class", "OSD");
        onScreenDisplay.appendChild(this.CreateOSD());

        //append Player and OSD
        wrapper.appendChild(jPlayerElement);
        wrapper.appendChild(onScreenDisplay);
        Log.log("DOM created");

        return wrapper;
    },

    getHeader: function () {
        return this.data.header + " " + VERSION;
    },

    // Define styles.
    getStyles: function () {
        return ["webradio_styles.css"];
    },

    start: function () {
        this.config.startIndex = this.config.startIndex;
    },

    getScripts: function () {
        return [
            this.file("jquery.min.js"),
            this.file("jquery.jplayer.min.js"),
        ]
    },

    notificationReceived: function (notification, payload, sender) {
        if (notification == "DOM_OBJECTS_CREATED") {
            this.initPlayer();
        }

        if (notification) {
            Log.log(this.name + ' received a notification: ' + notification);

            if (notification == "WEBRADIO_ONOFF") {
                if (this.config.alreadyPlaying == true) {
                    this.pauseStream();
                }
                else {
                    this.playStream();
                }
            }
            else if (this.config.alreadyPlaying == true) {
                if (notification == "WEBRADIO_VOLUP") {
                    this.VolumeUp();
                }
                else if (notification == "WEBRADIO_VOLDOWN") {
                    this.VolumeDown();
                }
                else if (notification == "WEBRADIO_NEXT") {
                    this.NextStation();
                }
                else if (notification == "WEBRADIO_PREV") {
                    this.PreviousStation();
                }
            }
        }
    },


    CreateOSD: function () {
        var osd = document.createElement("div");
        var playback = document.createElement("div");
        var volume = document.createElement("div");

        if (this.config.alreadyPlaying == true) {
            //Crate stationName
            playback.innerHTML = "Currently Playing: ";
            playback.className = "CurrentlyPlaying";

            var stationName = document.createElement("span");
            stationName.innerHTML = this.config.streams[this.config.startIndex].text;
            stationName.className = "StationName";
            playback.appendChild(stationName);

            //Create Volume
            volume.innerHTML = "Volume: ";
            volume.className = "VolumeMid";

            var volumeValue = document.createElement("span");
            volumeValue.innerHTML = this.config.currentVolume + "%";
            if (this.config.currentVolume <= 15) {
                volumeValue.className = "VolumeLowest";
            }
            else if (this.config.currentVolume <= 35) {
                volumeValue.className = "VolumeLow";
            }
            else if (this.config.currentVolume < 65) {
                volumeValue.className = "VolumeMid";
            }
            else if (this.config.currentVolume < 85) {
                volumeValue.className = "VolumeHigh";
            }
            else{
                volumeValue.className = "VolumeHighest";
            }
            volume.appendChild(volumeValue);
        }
        else {
            //Crate Not Playing display
            playback.innerHTML = "Playback currently paused";
            playback.className = "PlaybackPaused";

            //Crate emptyLine
            volume.innerHTML = "  ";
        }

        osd.appendChild(playback);
        osd.appendChild(volume);

        return osd;
    },

    updateMirror: function () {
        Log.log("Identifier is: " + this.identifier);
        var moduleWrapper = document.getElementById(this.identifier);
        var contentWrapper = moduleWrapper.getElementsByClassName("module-content");
        contentWrapper = moduleWrapper.getElementsByClassName("Webplayer");
        contentWrapper = moduleWrapper.getElementsByClassName("OSD");

        contentWrapper[0].innerHTML = "";
        contentWrapper[0].appendChild(this.CreateOSD());
    },

	initPlayer: function()
	{
		$("#jquery_jplayer_1").jPlayer(
		{
		    swfPath: "http://jplayer.org/latest/dist/jplayer",
	        supplied: "mp3",
			preload: "none",
			volume: 1,	
			wmode: "window",
			useStateClassSkin: true,
			autoBlur: false,
			keyEnabled: true,
			volume: this.config.currentVolume,
		});	
		
		Log.log("init done");
	},

	playStream: function()
    {
		var stream = { mp3: this.config.streams[this.config.startIndex].url };
	
		Log.log("starting to Play");
        $("#jquery_jplayer_1").jPlayer("clearMedia");
        $("#jquery_jplayer_1").jPlayer("setMedia", stream);
        $("#jquery_jplayer_1").jPlayer("volume", this.config.currentVolume / 100);
        $("#jquery_jplayer_1").jPlayer("play"); 

		Log.log("playing " + this.config.streams[this.config.startIndex].text);
        this.config.alreadyPlaying = true;
        this.updateMirror();
    },

	SetVolume: function()
	{
		$("#jquery_jplayer_1").jPlayer("volume", this.config.currentVolume / 100);
        Log.log("Volume set to: " + this.config.currentVolume + "%");
        this.updateMirror();
	},

    NextStation: function () {
        if (this.config.startIndex < this.config.streams.length - 1) {
            this.config.startIndex = this.config.startIndex + 1;
        }
        else {
            this.config.startIndex = 0;
        }
        Log.log("set index to " + this.config.startIndex);
        this.playStream();
    },

    PreviousStation: function () {
        if (this.config.startIndex > 0) {
            this.config.startIndex = this.config.startIndex - 1;
        }
        else {
            this.config.startIndex = this.config.streams.length - 1;
        }
        Log.log("set index to " + this.config.startIndex);
        this.playStream();
    },

    VolumeUp: function() {
        if (this.config.currentVolume < 100) {
            this.config.currentVolume = this.config.currentVolume + 5;
            this.SetVolume();
        }
    },

    VolumeDown: function() {
        if (this.config.currentVolume > 0) {
            this.config.currentVolume = this.config.currentVolume - 5;
            this.SetVolume();
        }
    },

	pauseStream: function()
	{
		Log.log("Pausing");
		$.jPlayer.pause();
        this.config.alreadyPlaying = false;
        this.updateMirror();
	}
});