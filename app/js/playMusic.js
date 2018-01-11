function playMusic(finalPitchArray,durationMapping,index,instrument,tempo)
{
    //var instrumentArray = {"acoustic_grand_piano": 0, "synth_drum": 118};
    var delay = 0; // play one note every quarter second
    var note = 50; // the MIDI note
    var velocity = 127; // how hard the note hits
    //var speedRate = 0.09;
    //window.alert(instrument.name +" " + instrument.no);
    //MIDI.programChange(index, instrument.no); // set channel index to instrument value in array
    //MIDI.programChange(index, 24);
    //window.alert(MIDI.GM.byName[instrument.name].number);
    MIDI.programChange(index, MIDI.GM.byName[instrument.name].number);
    MIDI.setVolume(index, 127);
    //MIDI.programChange(0, 0); // set channel 0 to piano
    //MIDI.programChange(0, 118); // set channel 1 to guitar
    // play the note
    //MIDI.Player.BPM = 500;
    //MIDI.setVolume(0, 127);
    //MIDI.setVolume(1, 127);


    var startTime = 0;
    var endTime = 0;
    //var finalPitchArray=[50,60,70,80,22];
    //var durationMappingScale=[1,2,3,6,1];
    /* Convert durationMapping into tick temp
     * Because original 0 in duration will not be play so it should be mapped to music tick
     * */
    var noteDurations = [2,3,4,6,8,12,16,24,32,48];
    var durationMappingScale = new Array(durationMapping.length);
    for(var i = 0; i< durationMappingScale.length ; i++)
    {
        durationMappingScale[i] = noteDurations[durationMapping[i]];
    }

    //End converting duration tick


    for(var i = 0 ; i< finalPitchArray.length ; i++)
    {
        var pitchValue = finalPitchArray[i];

        if(isNaN(pitchValue)){
            //pitchValue == 150;
            startTime += durationMappingScale[i]/tempo;
            endTime = startTime;
        }else {
            MIDI.noteOn(index, pitchValue+20, velocity, startTime); //set tempo faster hardcode now, later change algorithm
            // MIDI.noteOn(1, 25, velocity, startTime+1);
            //track.add(createNoteOnEvent(pitchValue+20, startTime));
            startTime += durationMappingScale[i]/tempo;
            endTime = startTime;

            MIDI.noteOff(index, pitchValue + 20, endTime);
        }




    }
}

function playAll(allVoices,tempo)
{
    //alert("play all");
    //var instrumentArray = {"acoustic_grand_piano": 0, "synth_drum": 118};
    var velocity = 127; // how hard the note hits
    //var speedRate = 0.09;
    var speedRate = 2;
    var arrOfTimeoutArr=[];
    for(var k = 0; k < allVoices.length; k++)
    {

        var obj = allVoices[k];
        var muted = obj.muted;
        if(muted == 0)
        {

            var finalPitchArray = obj.finalPitchMapping;
            var durationMapping = obj.durationMapping;
            var instrument = obj.instrument;
            //MIDI.programChange(index, instrument.no);
            MIDI.programChange(k, MIDI.GM.byName[instrument.name].number);
            MIDI.setVolume(k, 127);

            var startTime = 0;
            var endTime = 0;
            /* Convert durationMapping into tick temp
             * Because original 0 in duration will not be play so it should be mapped to music tick
             * */
            //alert("duration mapping :" + durationMapping);
            var durationMappingScale = getDurationMappingScale_play(durationMapping);

            //alert("scale : " + durationMappingScale);
            //End converting duration tick

            /**
             * Because the light up keyboard use timeout so it needs delta time,
             * newDurationMappingScale created for that purpose
             * For example, duration is 2,3,4,5
             * timeout needs to  be, 0, 2=2+0, 5 = 2+3, 9 = 4 +5
             */
            var durationMappingScaleForTimeOut = getDurationMappingScaleForTimeOut(durationMappingScale);


           // alert("time out :" + durationMappingScaleForTimeOut);

            //console.log(durationMappingScaleForTimeOut);
            arrOfTimeoutArr.push(durationMappingScaleForTimeOut);

            for(var i = 0 ; i< finalPitchArray.length ; i++)
            {
                var pitchValue = finalPitchArray[i];
                //MIDI.noteOn(k, pitchValue+20, velocity, startTime ); //set tempo faster hardcode now, later change algorithm
                // MIDI.noteOn(1, 25, velocity, startTime+1);
                startTime += durationMappingScale[i]/tempo;
                endTime = startTime;
                //MIDI.noteOff(k, pitchValue + 20, endTime );
                //MIDI.noteOff(1, 25, endTime);

                /*
                (function (x,y,z) {
                    setTimeout(function () {
                            unColorKeys();
                            colorKey(finalPitchArray[x],y);
                            //colorKey(finalPitchArray[x],y+1);
                            document.getElementById("pitchDisplay").innerHTML = document.getElementById("pitchDisplay").innerHTML + " " +finalPitchArray[x] ;

                        },
                        durationMappingScaleForTimeOut[x]*(1000/tempo));
                })(i,k,tempo);
                */

            }


        }

    }
    //alert(arrOfTimeoutArr.length);

    var timeoutA = arrOfTimeoutArr[0];
    if(arrOfTimeoutArr.length > 1){ //merge only when there are more than 1 voice
        for(var i = 1; i < arrOfTimeoutArr.length; i++){
            timeoutA = mergeTwoSortedArr(timeoutA,arrOfTimeoutArr[i]);
        }
    }


    for(var i = 0; i < arrOfTimeoutArr.length; i++){
        //alert(arrOfTimeoutArr[i]);

        var newVoice1 = arrOfTimeoutArr[i];
        var obj = allVoices[i].finalPitchMapping;
        //alert(obj);
        //alert(arrOfTimeoutArr[i]);
        for(var j = 0 ; j < timeoutA.length;j++)
        {
            /*
            if(arrOfTimeoutArr[i][j] == timeoutA[j]){
                newVoice1.push(obj[j]);
            }else {
                newVoice1.push(0);
            }
            */

        }
        //alert(newVoice1);

    }
    //var timeoutAA = [[0,1,1],[6,23,18]];
    //var timeoutA = [0,6,12,18,24,36,60,84,120,156,192,240];
    var voice_combine = [[1,1],[23,18],[45,0],[66,18],[88,0],[0,28],[0,35],[0,45],[0,55],[0,66],[0,77],[0,88]];
    var scale_combine = [[6,6],[6,12],[6,0],[6,18],[48,0],[0,24],[0,24],[0,36],[0,36],[0,36],[0,48],[0,48]];

    var voice_1 = [1,23,45,66,88];
    var voice_2 = [1,18,0,18,0,28,35,45,55,66,77,88];
    var startTime1 = 0;
    var endTime1 = 0;

    var startTime2 = 0;
    var endTime2 = 0;

    for(var i = 0; i < timeoutA.length; i++)
    {


        var voice1_arr = voice_combine[i];
        var voice_scale = scale_combine[i];

        //voice 1

        if(voice1_arr[0] != 0)
        {
            MIDI.noteOn(0, voice1_arr[0]+20, 127, startTime1 ); //set tempo faster hardcode now, later change algorithm

            startTime1 += voice_scale[0]/tempo;
            endTime1 = startTime1;
            MIDI.noteOff(0, voice1_arr[0] + 20, endTime1 );
        }


        //voice 2
        if(voice1_arr[1] != 0)
        {
            MIDI.noteOn(1, voice1_arr[1]+20, 127, startTime2 ); //set tempo faster hardcode now, later change algorithm

            startTime2 += voice_scale[1]/tempo;
            endTime2 = startTime2;
            MIDI.noteOff(1, voice1_arr[1] + 20, endTime2 );
        }




        (function (x,z) {
            setTimeout(function () {
                    unColorKeys();
                    /*
                    if(timeoutA[x] == 0 || timeoutA[x] == 6 || timeoutA[x] == 18)
                    {
                        colorKey(voice_1[x],0);
                        colorKey(voice_2[x],1);
                    }

                    else if(timeoutA[x] == 12 || timeoutA[x] == 24)
                    {
                        colorKey(voice_1[x],0);
                    }
                    else
                    {
                        colorKey(voice_2[x],1);
                    }
                    */

                    var playNoteA = voice_combine[x];
                    for(var k = 0; k < playNoteA.length; k++)
                    {
                        colorKey(playNoteA[k],k);
                    }

                    //document.getElementById("pitchDisplay").innerHTML = document.getElementById("pitchDisplay").innerHTML + " " +finalPitchArray[x] ;

                },
                timeoutA[x]*(1000/tempo));
        })(i,tempo);
    }

    console.log("end playALl");
    /*
    * Play light
    * */


    /*
    for (var i = 0 ; i< finalPitchArray.length ; i++) {
        (function(index) {
            setTimeout(function()
                {
                    unColorKeys();
                    colorKey(index);
                    document.getElementById("pitchDisplay").innerHTML = document.getElementById("pitchDisplay").innerHTML + " " +finalPitchArray[index] ;
                    //document.getElementById("durationDisplay").innerHTML = document.getElementById("durationDisplay").innerHTML +"4,";
                },
                durationMappingScale[i] * 1000);
        })(i);
    }
    */

    /**
     * Process for timeout duration. newDurationMappingScale is cummulated duratio
     */


    //alert(durationMappingScale);
    /*
        for (var i = 0 ; i< finalPitchArray.length ; i++) {
            (function (x) {
                setTimeout(function () {
                    unColorKeys();
                    colorKey(finalPitchArray[x]);
                    document.getElementById("pitchDisplay").innerHTML = document.getElementById("pitchDisplay").innerHTML + " " +finalPitchArray[x] ;

                },
                    newDurationMappingScale[x]*1000);
            })(i);
        }
*/
    //unColorKeys();
    document.getElementById("pitchDisplay").innerHTML = "";
    /*End play ligh*/
} //End playAll

function getDurationMappingScale_play(durationMapping)
{
    /* Convert durationMapping into tick temp
     * Because original 0 in duration will not be play so it should be mapped to music tick
     * */
    //var noteDurations = [2,3,4,6,8,12,16,24,32,48];
    var noteDurations = [6,9,12,18,24,36,48,72,96,144];
    var durationMappingScale = new Array(durationMapping.length);
    for(var i = 0; i< durationMappingScale.length ; i++)
    {
        durationMappingScale[i] = noteDurations[durationMapping[i]];
    }
    return durationMappingScale;
}

function getDurationMappingScaleForTimeOut(durationMappingScale)
{
    var durationMappingScaleForTimeOut = [];
    durationMappingScaleForTimeOut[0] = 0;
    for(var i = 1 ; i< durationMappingScale.length ; i++)
    {
        durationMappingScaleForTimeOut[i] = durationMappingScale[i-1] + durationMappingScaleForTimeOut[i-1];
    }
    return durationMappingScaleForTimeOut;
}

function mergeTwoSortedArr(arr1,arr2) {
    var result = [];
    var i = 0, j = 0;
    //Traverse both array
    while(i < arr1.length && j < arr2.length)
    {
        // Check if current element of first
        // array is smaller than current element
        // of second array. If yes, store first
        // array element and increment first array
        // index. Otherwise do same with second array
        if(arr1[i] < arr2[j])
        {
            if(result.indexOf(arr1[i]) == -1){
                result.push(arr1[i]);
            }
            i++;
        }
        else
        {
            if(result.indexOf(arr2[j]) < 0) {
                result.push(arr2[j]);
            }
            j++;
        }

    }

    // Store remaining elements of first array
    while(i < arr1.length)
    {
        //if(result.indexOf(arr1[i]) < 0)
        result.push(arr1[i++]);
    }

    // Store remaining elements of second array
    while(j < arr2.length)
    {
        //if(result.indexOf(arr2[j]) < 0)
        result.push(arr2[j++]);
    }
    return result;
}

function colorKey(note,voiceNo)
{
    if(voiceNo == 0)
        $("#"+note).css("background","#ee421f");
    else if(voiceNo == 1)
        $("#"+note).css("background","#71ee13");
    else if(voiceNo == 2)
        $("#"+note).css("background","#132cee");
    else if(voiceNo == 3)
        $("#"+note).css("background","#ee19e4");
}

function unColorKeys()
{
    $(".keyWhite").css("background","white");
    $(".keyBlack").css("background","black");
}

function playAll2(allVoices,tempo)
{
    //alert(gl);
    /*
    var delay = 0; // play one note every quarter second
    var note = 80; // the MIDI note
    var velocity = 127; // how hard the note hits
    // play the note
    MIDI.programChange(0,0);
    MIDI.setVolume(0, 127);
    MIDI.noteOn(0, note, velocity, 0);
    MIDI.noteOff(0, note, 10);
    */
    song.push("data:audio/mid;base64,TVRoZAAAAAYAAQACABhNVHJrAAAAEwD/WAQEAhgIAP9RAw9CQAD/LwBNVHJrAAAAVwDAAQCQFngCgBZ4AJAfeAOAH3gAkCl4A4ApeACQM3gEgDN4AJA8eAaAPHgAkEZ4DIBGeACQT3gDgE94AJBZeBCAWXgAkGN4AoBjeACQbHgQgGx4AP8vAA==");
    player = MIDI.Player;
    player.timeWarp = 1; // speed the song is played back
    player.loadFile(song[songid++ % song.length]);
    player.start();
    var d = document.getElementById("pausePlayStop");

    if(player.playing)
    {
        d.src = "./img/pause.png";
    }else {
        d.src = "./img/play.png";
    }

}

function pause() {

    MIDI.Player.pause(true);
}

function resume() {
    MIDI.Player.resume();
}


var resumeF = false;

function createKeyboard(){
    var colors = document.getElementById("colors");
    var colorElements = [];
    for (var n = 0; n < 88; n++) {
        var d = document.createElement("div");
        d.style.cssFloat="left";
        d.innerHTML = MIDI.noteToKey[n + 21];
        colorElements.push(d);
        colors.appendChild(d);
        /*
        if(colorElements.length <= 88 ){

        }*/

    }

}

function pausePlayStop(tempo,stop,loadData) {
    //d.src = "./img/pause.png";
    //alert(loadData);
    //console.log(loadData);
    var d = document.getElementById("playPauseBtn");
    d.src = "./img/pause.png";
   if(typeof player === 'undefined' || player.currentTime == player.endTime ||player.currentTime == 0 )
   {
       song.pop();
       var songData = "data:audio/mid;base64,"+loadData;
       //song.push("data:audio/mid;base64,TVRoZAAAAAYAAQACABhNVHJrAAAAEwD/WAQEAhgIAP9RAw9CQAD/LwBNVHJrAAAAVwDAAQCQFngCgBZ4AJAfeAOAH3gAkCl4A4ApeACQM3gEgDN4AJA8eAaAPHgAkEZ4DIBGeACQT3gDgE94AJBZeBCAWXgAkGN4AoBjeACQbHgQgGx4AP8vAA==");
       song.push(songData);
       player = MIDI.Player;
       player.timeWarp = 1; // speed the song is played back
       player.BPM = tempo;
       player.loadFile(song[0]);
       /// load up the piano keys

       MIDI.loader = new sketch.ui.Timer;

       var colors = document.getElementById("colors");
       colors.textContent = '';
       var colorElements = [];
       for (var n = 0; n < 88; n++) {
           var d = document.createElement("div");
           d.style.cssFloat="left";
           d.innerHTML = MIDI.noteToKey[n + 21];


            if(colorElements.length <= 88 ){
                colorElements.push(d);
                colors.appendChild(d);
            }

       }

       var colorMap = MIDI.Synesthesia.map();

       player.addListener(function(data) {
           var pianoKey = data.note - 21;
           var d = colorElements[pianoKey];
           if (d) {
               if (data.message === 144) {
                   var map = colorMap[data.note - 27];
                   if (map) d.style.background = map.hex;
                   d.style.color = "#fff";
               } else {
                   d.style.background = "";
                   d.style.color = "";
               }
           }
       });

       MIDIPlayerPercentage(player);
   }

   if(stop)
   {
       player.stop();
       d.src = "./img/play.png";
   }else {
       if(player.playing)
       {
           player.pause();
           d.src = "./img/play.png";
       }else {
           console.log("stop :" + stop);
           d.src = "./img/pause.png";
           player.start();

       }


   }
}

var MIDIPlayerPercentage = function(player) {
    // update the timestamp
    var time1 = document.getElementById("time1");
    var time2 = document.getElementById("time2");
    var capsule = document.getElementById("capsule");
    var timeCursor = document.getElementById("cursor");
    //
    eventjs.add(capsule, "drag", function(event, self) {
        eventjs.cancel(event);
        player.currentTime = (self.x) / 420 * player.endTime;
        if (player.currentTime < 0) player.currentTime = 0;
        if (player.currentTime > player.endTime) player.currentTime = player.endTime;
        if (self.state === "down") {
            player.pause(true);
        } else if (self.state === "up") {
            player.resume();
        }
    });
    //
    function timeFormatting(n) {
        var minutes = n / 60 >> 0;
        var seconds = String(n - (minutes * 60) >> 0);
        if (seconds.length == 1) seconds = "0" + seconds;
        return minutes + ":" + seconds;
    };

    player.setAnimation(function(data, element) {
        var percent = data.now / data.end;
        var now = data.now >> 0; // where we are now
        var end = data.end >> 0; // end of song
        if (now === end) { // go to next song
            var id = ++songid % song.length;
            //player.loadFile(song[id], player.start); // load MIDI
        }
        // display the information to the user
        timeCursor.style.width = (percent * 100) + "%";
        time1.innerHTML = timeFormatting(now);
        time2.innerHTML = "-" + timeFormatting(end - now);
    });
};


// Begin loading indication.

var player;
// MIDI files from Disklavier World
var songid = 0;
var song =
    [
    ];