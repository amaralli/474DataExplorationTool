$(function() {
	//reads data file
	d3.csv('data/hate_crime_data.csv', function(error, allData) {

		var xScale, yScale, currentData;

		//variable to alter graphic
		var biasType = 'Race';
		var recordType = 'Offenses';

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
		var transitionTime = 1000;

		// Height/width of the drawing area for data symbols
		var height = heightBound - margin.bottom - margin.top;
		var width = widthBound - margin.left - margin.right;

		//create and grab the SVG element
		var svg = d3.select('#vis')
					.append('svg')
					.attr('height', heightBound)
					.attr('width', widthBound);

		//create a G element to draw rectangles on
		var rect = svg.append('g');

		//append an xAxis label to the SVG, with appropriate margins
		var xAxisLabel = svg.append('g')
							.attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
							.attr('class', 'axis')


		//append an xAxis label to the SVG, with appropriate margins
		var yAxisLabel = svg.append('g')
							.attr('class', 'axis')
							.attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')


		//append text to label the x axis
		var xAxisText = svg.append('text')
						   .attr('transform', 'translate(' + (margin.left + width/2) + ',' + (height + margin.top + 40) + ')')
						   .attr('class', 'title')

		//append text to label the y axis
		var yAxisText = svg.append('text')
						   .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + height/2) + ') rotate(-90)')
						   .attr('class', 'title');

		
	    var scale = function(data) {
			var biases = data.map(function(d) {
				return d.Bias
			});

			xScale = d3.scale.ordinal().rangeBands([0, width], .1).domain(biases);

			//var yMin = d3.min(data, function(d) {return +d.Offenses});
			var yMax = d3.max(data, function(d) {return +d[recordType]});

			yScale = d3.scale.linear().range([height, 0]).domain([0, yMax]);
		}

		var setAxes = function() {
			var xAxis = d3.svg.axis()
						  .scale(xScale)
						  .orient('bottom');

			var yAxis = d3.svg.axis()
						  .scale(yScale)
						  .orient('left')
						  .tickFormat(d3.format('.2s'));

	    	xAxisLabel.transition().duration(transitionTime).call(xAxis);
	    	yAxisLabel.transition().duration(transitionTime).call(yAxis);


	    	xAxisText.text('Hate Crimes Against Groups By ' + biasType);
	    	yAxisText.text('Number of ' + recordType);
		}

		var adjustData = function() {
			currentData = allData.filter(function(d) {
				return d.Type == biasType;
			})
			.sort(function(a, b) {
				if(a.Bias < b.Bias) return -1;
				if(a.Bias > b.Bias) return 1;
				return 0;
			})
		}



		var draw = function(data) {
			scale(data);

			setAxes();

			var bars = svg.selectAll('rect').data(data);

		    bars.enter()
		    	.append('rect')
		    	.attr('x', function(d) {
		    		return margin.left + xScale(d.Bias);
		    	})
		    	.attr('y', 0)
		    	.attr('height', 0)
		    	.attr('width', xScale.rangeBand())
		    	.attr('title', function(d) {
		    		return d.Bias;
		    	})
		    	.style('fill', '#18c3bd');

	    	bars.exit().remove();

	    	bars.transition()
	    		.duration(transitionTime)
	    		.delay(function(d, i) {
	    			return i * 50;
	    		})
	    		.attr('x', function(d) {
	    			return margin.left + xScale(d.Bias)
	    		})
	    		.attr('y', function(d) {
	    			return margin.top + yScale(parseInt(d[recordType], 10))
	    		})
	    		.attr('height', function(d) {
	    			return height - yScale(parseInt(d[recordType], 10))
	    		})
	    		.attr('width', xScale.rangeBand())
	    		.attr('title', function(d) {return d.Bias})
	    		.style('fill', '#18c3bd');
		};

		$("input").on('change', function() {
			var val = $(this).val();
			if($(this).hasClass('biasType')) {
				biasType = val;
			} else {
				recordType = val;
			}

			adjustData();
			draw(currentData);
		})

		adjustData();
		draw(currentData);
			
	});


});