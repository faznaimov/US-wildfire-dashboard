function makeResponsive() {

	// if the SVG area isn't empty when the browser loads,
	// remove it and replace it with a resized version of the chart
	var svgArea = d3.select("body").select("svg");

	// clear svg is not empty
  	if (!svgArea.empty()) {
    svgArea.remove();
	  }
	
	// SVG wrapper dimensions are determined by the current width and
  	// height of the browser window.
  	var width = window.innerWidth;
  	var height = window.innerHeight/1.7;
	/*
	################ FORMATS ##################
	-------------------------------------------
	*/


	var 	formatAsPercentage = d3.format("%"),
			formatAsPercentage1Dec = d3.format(".1%"),
			formatAsInteger = d3.format(","),
			fsec = d3.time.format("%S s"),
			fmin = d3.time.format("%M m"),
			fhou = d3.time.format("%H h"),
			fwee = d3.time.format("%a"),
			fdat = d3.time.format("%d d"),
			fmon = d3.time.format("%b")
			;

	/*
	############# PIE CHART ###################
	-------------------------------------------
	*/


	function dsPieChart(){

		var dataset = [
				{cause: "Arson", measure: 0.1},
				{cause: "Campfire", measure: 0.1},
				{cause: "Children", measure: 0.1},
				{cause: "Debris Burning", measure: 0.1},
				{cause: "Equipment", measure: 0.1},
				{cause: "Fireworks", measure:0.1},
				{cause: "Lightning", measure: 0.05},
				{cause: "Miscellaneous", measure: 0.05},
				{cause: "Undefined", measure: 0.05},
				{cause: "Powerline", measure: 0.05},
				{cause: "Railroad", measure: 0.05},
				{cause: "Smoking", measure: 0.05},
				{cause: "Structure", measure: 0.05}
				];

		var     pieWidth = width,
				pieHeight = height,
				outerRadius = Math.min(pieWidth, pieHeight) / 2,
				innerRadius = outerRadius * .999,   
				// for animation
				innerRadiusFinal = outerRadius * .35,
				color = d3.scale.category20()
				;    //builtin range of colors
			
		var vis = d3.select("#pieChart")
				.append("svg:svg")              //create the SVG element inside the <body>
				.data([dataset])                //associate our data with the document
				.attr("width", pieWidth)           //set the width and height of our visualization (these will be attributes of the <svg> tag
				.attr("height", pieHeight)
				.append("svg:g")                //make a cause to hold our pie chart
				.attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")    //move the center of the pie chart from 0, 0 to radius, radius
				;
					
		var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
				.outerRadius(outerRadius).innerRadius(innerRadius);
	
	// for animation
		var arcFinal = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius-20);
		var arcFinal3 = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);

		var pie = d3.layout.pie()           //this will create arc data for us given a list of values
			.value(function(d) { return d.measure; });    //we must tell it out to access the value of each element in our data array

	var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
			.data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
			.enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
			.append("svg:g")                //create a cause to hold each slice (we will have a <path> and a <text> element associated with each slice)
			.attr("class", "slice")    //allow us to style things in the slices (like text)
			.on("mouseover", mouseover)
			.on("mouseout", mouseout)
			.on("click", up)
			;
						
			arcs.append("svg:path")
				.attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
				.attr("d", arc)     //this creates the actual SVG path using the associated data (pie) with the arc drawing function
					.append("svg:title") //mouseover title showing the figures
					.text(function(d) { return d.data.cause + ": " + formatAsPercentage(d.data.measure); });			

			d3.selectAll("g.slice").selectAll("path").transition()
					.duration(750)
					.delay(10)
					.attr("d", arcFinal )
					;
		
		// Add a label to the larger arcs, translated to the arc centroid and rotated.
		arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; })
				.append("svg:text")
				.attr("dy", ".35em")
				.attr("text-anchor", "middle")
				.attr("transform", function(d) { return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")"; })
				//.text(function(d) { return formatAsPercentage(d.value); })
				.text(function(d) { return d.data.cause; })
			;
		
		// Computes the label angle of an arc, converting from radians to degrees.
			function angle(d) {
				var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
				return a > 90 ? a - 180 : a;
			}
				
			// Pie chart title			
			vis.append("svg:text")
				.attr("dy", ".35em")
				.attr("text-anchor", "middle")
				.text("Wildfire 1992-2015")
				.attr("class","title")
				;		    
			
		function mouseover() {
		d3.select(this).select("path").transition()
				.duration(750)
				// .attr("stroke","black")
				//.attr("stroke-width", 1.5)
				.attr("d", arcFinal3)
				;
		}
		
		function mouseout() {
		d3.select(this).select("path").transition()
				.duration(750)
				//.attr("stroke","blue")
				//.attr("stroke-width", 1.5)
				.attr("d", arcFinal)
				;
		}
		
		function up(d, i) {
		
					/* update bar chart when user selects piece of the pie chart */
					//updateBarChart(dataset[i].cause);
					updateBarChart(d.data.cause, color(i));
					updateLineChart(d.data.cause, color(i));
				
		}
	}

	dsPieChart();

		/*
	############# BAR CHART ###################
	-------------------------------------------
	*/



	var datasetBarChart = [
	{ cause: "All", year: "2001", count: 63850.4963 }, 
	{ cause: "All", year: "2002", count: 78258.0845 }, 
	{ cause: "All", year: "2003", count: 60610.2355 }, 
	{ cause: "All", year: "2004", count: 30493.1686 }, 
	{ cause: "All", year: "2005", count: 56097.0151 }, 
	{ cause: "Campfire", year: "2001", count: 19441.5648 }, 
	{ cause: "Campfire", year: "2002", count: 25922.0864 }, 
	{ cause: "Campfire", year: "2003", count: 9720.7824 }, 
	{ cause: "Campfire", year: "2004", count: 6480.5216 }, 
	{ cause: "Campfire", year: "2005", count: 19441.5648 }, 
	{ cause: "Children", year: "2001", count: 22913.2728 }, 
	{ cause: "Children", year: "2002", count: 7637.7576 }, 
	{ cause: "Children", year: "2003", count: 23549.7526 }, 
	{ cause: "Children", year: "2004", count: 1909.4394 }, 
	{ cause: "Children", year: "2005", count: 7637.7576 }, 
	{ cause: "Lighting", year: "2001", count: 1041.5124 }, 
	{ cause: "Lighting", year: "2002", count: 2430.1956 }, 
	{ cause: "Lighting", year: "2003", count: 15275.5152 }, 
	{ cause: "Lighting", year: "2004", count: 4166.0496 }, 
	{ cause: "Lighting", year: "2005", count: 11803.8072 }, 
	{ cause: "Smoking", year: "2001", count: 7406.3104 }, 
	{ cause: "Smoking", year: "2002", count: 2545.9192 }, 
	{ cause: "Smoking", year: "2003", count: 1620.1304 }, 
	{ cause: "Smoking", year: "2004", count: 8563.5464 }, 
	{ cause: "Smoking", year: "2005", count: 3008.8136 }, 
	{ cause: "Structure", year: "2001", count: 7637.7576 }, 
	{ cause: "Structure", year: "2002", count: 35411.4216 }, 
	{ cause: "Structure", year: "2003", count: 8332.0992 }, 
	{ cause: "Structure", year: "2004", count: 6249.0744 }, 
	{ cause: "Structure", year: "2005", count: 11803.8072 }, 
	{ cause: "Railroad", year: "2001", count: 3182.399 }, 
	{ cause: "Railroad", year: "2002", count: 867.927 }, 
	{ cause: "Railroad", year: "2003", count: 1808.18125 }, 
	{ cause: "Railroad", year: "2004", count: 795.59975 }, 
	{ cause: "Railroad", year: "2005", count: 578.618 }, 
	{ cause: "Campfire", year: "2001", count: 2227.6793 }, 
	{ cause: "Campfire", year: "2002", count: 3442.7771 }, 
	{ cause: "Campfire", year: "2003", count: 303.77445 }, 
	{ cause: "Campfire", year: "2004", count: 2328.93745 }, 
	{ cause: "Campfire", year: "2005", count: 1822.6467 }, 
	]
	;

	// set initial cause value
	var cause = "All";

	function datasetBarChosen(cause) {
		var ds = [];
		for (x in datasetBarChart) {
			if(datasetBarChart[x].cause==cause){
				ds.push(datasetBarChart[x]);
			} 
			}
		return ds;
	}


	function dsBarChartBasics() {

			var margin = {top: 30, right: 5, bottom: 20, left: 50},
			barWidth = width - margin.left - margin.right,
			barHeight = height - margin.top - margin.bottom,
			colorBar = d3.scale.category20(),
			barPadding = 1
			;
			
			return {
				margin : margin, 
				width : barWidth, 
				height : barHeight, 
				colorBar : colorBar, 
				barPadding : barPadding
			}			
			;
	}

	function dsBarChart() {

		var firstDatasetBarChart = datasetBarChosen(cause);         	
		
		var basics = dsBarChartBasics();
		
		var margin = basics.margin,
			width = basics.barWidth,
			height = basics.barHeight,
			colorBar = basics.colorBar,
			barPadding = basics.barPadding
			;
						
		var 	xScale = d3.scale.linear()
							.domain([0, firstDatasetBarChart.length])
							.range([0, width])
							;
							
		// Create linear y scale 
		// Purpose: No matter what the data is, the bar should fit into the svg area; bars should not
		// get higher than the svg height. Hence incoming data needs to be scaled to fit into the svg area.  
		var yScale = d3.scale.linear()
				// use the max funtion to derive end point of the domain (max value of the dataset)
				// do not use the min value of the dataset as min of the domain as otherwise you will not see the first bar
			.domain([0, d3.max(firstDatasetBarChart, function(d) { return d.count; })])
			// As coordinates are always defined from the top left corner, the y position of the bar
			// is the svg height minus the data value. So you basically draw the bar starting from the top. 
			// To have the y position calculated by the range function
			.range([height, 0])
			;
		
		//Create SVG element
		
		var svg = d3.select("#barChart")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr("id","barChartPlot")
				;
		
		var plot = svg
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
				;
					
		plot.selectAll("rect")
			.data(firstDatasetBarChart)
			.enter()
			.append("rect")
				.attr("x", function(d, i) {
					return xScale(i);
				})
			.attr("width", width / firstDatasetBarChart.length - barPadding)   
				.attr("y", function(d) {
					return yScale(d.count);
				})  
				.attr("height", function(d) {
					return height-yScale(d.count);
				})
				.attr("fill", "lightgrey")
				;
		
			
		// Add y labels to plot	
		
		plot.selectAll("text")
		.data(firstDatasetBarChart)
		.enter()
		.append("text")
		.text(function(d) {
				return formatAsInteger(d3.round(d.count));
		})
		.attr("text-anchor", "middle")
		// Set x position to the left edge of each bar plus half the bar width
		.attr("x", function(d, i) {
				return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
		})
		.attr("y", function(d) {
				return yScale(d.count) + 14;
		})
		.attr("class", "yAxis")
		/* moved to CSS			   
		.attr("font-family", "sans-serif")
		.attr("font-size", "11px")
		.attr("fill", "white")
		*/
		;
		
		// Add x labels to chart	
		
		var xLabels = svg
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + (margin.top + height)  + ")")
				;
		
		xLabels.selectAll("text.xAxis")
			.data(firstDatasetBarChart)
			.enter()
			.append("text")
			.text(function(d) { return d.year;})
			.attr("text-anchor", "middle")
				// Set x position to the left edge of each bar plus half the bar width
							.attr("x", function(d, i) {
									return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
							})
			.attr("y", 15)
			.attr("class", "xAxis")
			//.attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
			;			
		
		// Title
		
		svg.append("text")
			.attr("x", (width + margin.left + margin.right)/2)
			.attr("y", 15)
			.attr("class","title")				
			.attr("text-anchor", "middle")
			.text("Overall Sales Breakdown 2012")
			;
	}

	dsBarChart();

	/* ** UPDATE CHART ** */
	
	/* updates bar chart on request */

	function updateBarChart(cause, colorChosen) {
		
			var currentDatasetBarChart = datasetBarChosen(cause);
			
			var basics = dsBarChartBasics();
		
			var margin = basics.margin,
				width = basics.width,
			height = basics.height,
				colorBar = basics.colorBar,
				barPadding = basics.barPadding
				;
			
			var 	xScale = d3.scale.linear()
				.domain([0, currentDatasetBarChart.length])
				.range([0, width])
				;
			
				
			var yScale = d3.scale.linear()
			.domain([0, d3.max(currentDatasetBarChart, function(d) { return d.count; })])
			.range([height,0])
			;
			
		var svg = d3.select("#barChart svg");
			
		var plot = d3.select("#barChartPlot")
			.datum(currentDatasetBarChart)
			;
		
				/* Note that here we only have to select the elements - no more appending! */
			plot.selectAll("rect")
			.data(currentDatasetBarChart)
			.transition()
				.duration(750)
				.attr("x", function(d, i) {
					return xScale(i);
				})
			.attr("width", width / currentDatasetBarChart.length - barPadding)   
				.attr("y", function(d) {
					return yScale(d.count);
				})  
				.attr("height", function(d) {
					return height-yScale(d.count);
				})
				.attr("fill", colorChosen)
				;
			
			plot.selectAll("text.yAxis") // target the text element(s) which has a yAxis class defined
				.data(currentDatasetBarChart)
				.transition()
				.duration(750)
			.attr("text-anchor", "middle")
			.attr("x", function(d, i) {
					return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
			})
			.attr("y", function(d) {
					return yScale(d.count) + 14;
			})
			.text(function(d) {
					return formatAsInteger(d3.round(d.count));
			})
			.attr("class", "yAxis")					 
			;
			

			svg.selectAll("text.title") // target the text element(s) which has a title class defined
				.attr("x", (width + margin.left + margin.right)/2)
				.attr("y", 15)
				.attr("class","title")				
				.attr("text-anchor", "middle")
				.text(cause + "'s Sales Breakdown 2012")
			;
	}


	/*
	############# LINE CHART ##################
	-------------------------------------------
	*/

	var datasetLineChart = [
	{ cause: "All", year: 2008, count: 289309 }, 
	{ cause: "All", year: 2009, count: 234998 }, 
	{ cause: "All", year: 2010, count: 310900 }, 
	{ cause: "All", year: 2011, count: 223900 }, 
	{ cause: "All", year: 2012, count: 234500 }, 
	{ cause: "Campfire", year: 2008, count: 81006.52 }, 
	{ cause: "Campfire", year: 2009, count: 70499.4 }, 
	{ cause: "Campfire", year: 2010, count: 96379 }, 
	{ cause: "Campfire", year: 2011, count: 64931 }, 
	{ cause: "Campfire", year: 2012, count: 70350 }, 
	{ cause: "Children", year: 2008, count: 63647.98 }, 
	{ cause: "Children", year: 2009, count: 61099.48 }, 
	{ cause: "Children", year: 2010, count: 87052 }, 
	{ cause: "Children", year: 2011, count: 58214 }, 
	{ cause: "Children", year: 2012, count: 58625 }, 
	{ cause: "Smoking", year: 2008, count: 23144.72 }, 
	{ cause: "Smoking", year: 2009, count: 14099.88 }, 
	{ cause: "Smoking", year: 2010, count: 15545 }, 
	{ cause: "Smoking", year: 2011, count: 11195 }, 
	{ cause: "Smoking", year: 2012, count: 11725 }, 
	{ cause: "Lighting", year: 2008, count: 34717.08 }, 
	{ cause: "Lighting", year: 2009, count: 30549.74 }, 
	{ cause: "Lighting", year: 2010, count: 34199 }, 
	{ cause: "Lighting", year: 2011, count: 33585 }, 
	{ cause: "Lighting", year: 2012, count: 35175 }, 
	{ cause: "Structure", year: 2008, count: 69434.16 }, 
	{ cause: "Structure", year: 2009, count: 46999.6 }, 
	{ cause: "Structure", year: 2010, count: 62180 }, 
	{ cause: "Structure", year: 2011, count: 40302 }, 
	{ cause: "Structure", year: 2012, count: 42210 }, 
	{ cause: "Railroad", year: 2008, count: 7232.725 }, 
	{ cause: "Railroad", year: 2009, count: 4699.96 }, 
	{ cause: "Railroad", year: 2010, count: 6218 }, 
	{ cause: "Railroad", year: 2011, count: 8956 }, 
	{ cause: "Railroad", year: 2012, count: 9380 }, 
	{ cause: "Campfire", year: 2008, count: 10125.815 }, 
	{ cause: "Campfire", year: 2009, count: 7049.94 }, 
	{ cause: "Campfire", year: 2010, count: 9327 }, 
	{ cause: "Campfire", year: 2011, count: 6717 }, 
	{ cause: "Campfire", year: 2012, count: 7035 }
	]
	;

	// set initial year value
	var cause = "All";

	function datasetLineChartChosen(cause) {
		var ds = [];
		for (x in datasetLineChart) {
			if(datasetLineChart[x].cause==cause){
				ds.push(datasetLineChart[x]);
			} 
			}
		return ds;
	}

	function dsLineChartBasics() {

		var margin = {top: 20, right: 10, bottom: 0, left: 50},
			width = 500 - margin.left - margin.right,
			height = 150 - margin.top - margin.bottom
			;
			
			return {
				margin : margin, 
				width : width, 
				height : height
			}			
			;
	}


	function dsLineChart() {

		var firstDatasetLineChart = datasetLineChartChosen(cause);    
		
		var basics = dsLineChartBasics();
		
		var margin = basics.margin,
			width = basics.width,
		height = basics.height
			;

		var xScale = d3.scale.linear()
			.domain([0, firstDatasetLineChart.length-1])
			.range([0, width])
			;

		var yScale = d3.scale.linear()
			.domain([0, d3.max(firstDatasetLineChart, function(d) { return d.count; })])
			.range([height, 0])
			;
		
		var line = d3.svg.line()
			//.x(function(d) { return xScale(d.year); })
			.x(function(d, i) { return xScale(i); })
			.y(function(d) { return yScale(d.count); })
			;
		
		var svg = d3.select("#lineChart").append("svg")
			.datum(firstDatasetLineChart)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			// create cause and move it so that margins are respected (space for axis and title)
			
		var plot = svg
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("id", "lineChartPlot")
			;

			/* descriptive titles as part of plot -- start */
		var dsLength=firstDatasetLineChart.length;

		plot.append("text")
			.text(firstDatasetLineChart[dsLength-1].count)
			.attr("id","lineChartTitle2")
			.attr("x",width/2)
			.attr("y",height/2)	
			;
		/* descriptive titles -- end */
			
		plot.append("path")
			.attr("class", "line")
			.attr("d", line)	
			// add color
			.attr("stroke", "lightgrey")
			;
		
		plot.selectAll(".dot")
			.data(firstDatasetLineChart)
			.enter().append("circle")
			.attr("class", "dot")
			//.attr("stroke", function (d) { return d.count==datasetcountMin ? "red" : (d.count==datasetcountMax ? "green" : "steelblue") } )
			.attr("fill", function (d) { return d.count==d3.min(firstDatasetLineChart, function(d) { return d.count; }) ? "red" : (d.count==d3.max(firstDatasetLineChart, function(d) { return d.count; }) ? "green" : "white") } )
			//.attr("stroke-width", function (d) { return d.count==datasetcountMin || d.count==datasetcountMax ? "3px" : "1.5px"} )
			.attr("cx", line.x())
			.attr("cy", line.y())
			.attr("r", 3.5)
			.attr("stroke", "lightgrey")
			.append("title")
			.text(function(d) { return d.year + ": " + formatAsInteger(d.count); })
			;

		svg.append("text")
			.text("Performance 2012")
			.attr("id","lineChartTitle1")	
			.attr("x",margin.left + ((width + margin.right)/2))
			.attr("y", 10)
			;

	}

	dsLineChart();


	/* ** UPDATE CHART ** */
	
	/* updates bar chart on request */
	function updateLineChart(cause, colorChosen) {

		var currentDatasetLineChart = datasetLineChartChosen(cause);   

		var basics = dsLineChartBasics();
		
		var margin = basics.margin,
			width = basics.width,
		height = basics.height
			;

		var xScale = d3.scale.linear()
			.domain([0, currentDatasetLineChart.length-1])
			.range([0, width])
			;

		var yScale = d3.scale.linear()
			.domain([0, d3.max(currentDatasetLineChart, function(d) { return d.count; })])
			.range([height, 0])
			;
		
		var line = d3.svg.line()
		.x(function(d, i) { return xScale(i); })
		.y(function(d) { return yScale(d.count); })
		;

	var plot = d3.select("#lineChartPlot")
		.datum(currentDatasetLineChart)
		;
		
		/* descriptive titles as part of plot -- start */
		var dsLength=currentDatasetLineChart.length;
		
		plot.select("text")
			.text(currentDatasetLineChart[dsLength-1].count)
			;
		/* descriptive titles -- end */
		
		plot
		.select("path")
			.transition()
			.duration(750)			    
		.attr("class", "line")
		.attr("d", line)	
		// add color
			.attr("stroke", colorChosen)
		;
		
		var path = plot
			.selectAll(".dot")
		.data(currentDatasetLineChart)
		.transition()
			.duration(750)
		.attr("class", "dot")
		.attr("fill", function (d) { return d.count==d3.min(currentDatasetLineChart, function(d) { return d.count; }) ? "red" : (d.count==d3.max(currentDatasetLineChart, function(d) { return d.count; }) ? "green" : "white") } )
		.attr("cx", line.x())
		.attr("cy", line.y())
		.attr("r", 3.5)
		// add color
			.attr("stroke", colorChosen)
		;
		
		path
		.selectAll("title")
		.text(function(d) { return d.year + ": " + formatAsInteger(d.count); })	 
		;  

	}
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);