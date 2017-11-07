//////////////////////////////////////////////////////////graph start //////////////////////////////////
	google.load("visualization", "1");

	// Set callback to run when API is loaded
	//		google.setOnLoadCallback(drawVisualization);



	google.setOnLoadCallback(drawVisualization);

/*
window.addEventListener('load',addListener,false);
function addListener() {
  
drawVisualization();

}
*/
	var bool = 0;
	var sliderVal = 1;
	var targetData;
	var startingData;
	startingData();
	loadFile(getTargetdata);

	function updateMorph(){
		var slider = document.getElementById('slide');
		sliderVal = slider.value;	
		drawVisualization();
	}

	//Using function to update targetData with callback using asynchronous
	function getTargetdata(data){
		targetData = data;
	}

	function startingData(){
		startingData = new Array();

		for (var i = 0; i < 200; i++) {
			startingData[i] = Math.floor(Math.random()*200);
		}
	}

	//asynchronous function with callback
	function loadFile(callback){
		//Need to be set to server location
		var file = "file:///home/machine/Desktop/morph/trueBeethoven";
		var reader; 
		if (window.XMLHttpRequest) { // Mozilla, Safari, ...
		    reader = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // IE 8 and older
		    reader = new ActiveXObject("Microsoft.XMLHTTP");
		}

		reader.onreadystatechange = function ()
		{
			if(reader.readyState === 4)
			{
				if(reader.status === 200 || reader.status == 0){
					var data = reader.responseText.split("\n");
					callback(data.slice(0,data.length-2));
				}
			}
		}
		reader.open("GET", file,true);
		reader.send(null);
	}


	// Called when the Visualization API is loaded.
	function drawVisualization() {
		// Instantiate our graph object.
		var graph = new links.Graph(document.getElementById('mygraph'));


		var morphVal;
		var data = new google.visualization.DataTable();
		data.addColumn('number');
		data.addColumn('number', "Beethoven's 9th");
		data.addColumn('number', 'Dataset B');


		for (var i = 0; i < targetData.length; i++) {

			morphVal = (parseInt(targetData[i]) - parseInt(startingData[i]))*(sliderVal/100) + parseInt(startingData[i]);

			data.addRow([i+20,
			parseInt(targetData[i]),
			parseInt(morphVal) ]);
		}
	
		// specify options
		var options = {width:  "100%",height: "350px", 
		lines: [{color: "#0075BE", style: "dot"},
			{color: "#FF5506", style: "dot",}]
		};


		graph.draw(data, options);
	}
/*
///////////////////////////////////////////////////graph part /////////////////////////////////////
$(document).ready(function() {	
	
	

	var $slider = $( "#slider" ).slider();
//	$slider.find(".ui-slider-handle");
//	$slider.attr("title", "Defualt");

//	$slider.tooltip( {title: "50"});


	$slider.slider("option","min",1);
	$slider.slider("option","max",100);
	$slider.slider( "value", 55 );
	$slider.slider({
		change: function( event, ui ) {
		//	alert(ui.value);
		//	$slider.find(".ui-slider-handle");
			$slider.attr("title", ui.value+"%");
			loadFile();	
		}
	});

	function loadFile(){
		var fileName = "midiOutput.txt";

		$.get(fileName,function(data) {
			var file = data.split("\n");
			morphData(file);
		},"text");	
	}


	function morphData(targetFile){
		var tempVal;
		var $slider = $( "#slider" ).slider();
		var percent = $slider.slider("value")/100;
		var target = targetFile;
		var testSet = new Array();
		var result = new Array();
		
		var textArea = $("#morphBox");
	
		for(var i=0; i< target.length-1; i++){
			testSet[i]=(i+1);//%89;

			tempVal = (target[i]-testSet[i])*percent;			
			result[i] = (tempVal + testSet[i]) >> 0;
					 
		} 
		
		textArea.val(result);		
	}
	
});
*/
