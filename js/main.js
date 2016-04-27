$(function() {
	//reads data file
	d3.csv('data/hate_crime_data.csv', function(error, data) {

		// Margin: how much space to put in the SVG for axes/titles
		var margin = {
			left:70,
			bottom:100,
			top:50,
			right:50,
		};

		//constants for default graph size
		var heightBound = 600;
		var widthBound = 1000;

		//variable to alter graphic
		var measure = 'Race';

		// Height/width of the drawing area for data symbols
		var height = heightBound - margin.bottom - margin.top;
		var width = widthBound - margin.left - margin.right;

		
	});

	var draw = function(data, svg) {
		
	};
});