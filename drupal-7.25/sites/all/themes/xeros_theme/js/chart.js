function chart() {
    // Data to plot
    var competitorCost = [69, 64, 73, 77, 68, 72];
    var xerosCost = [57, 56, 62, 65, 62, 65];
    var months = ["JUN", "JUL", "AUG", "SEP", "OCT", "NOV"];

    // TRBL
    var chartMargins = [4, 50, 18, 16];
    var axisMargins = [4,20,0,0];

    // sets up the page
    var width = 292,
        height = 130;

    var chartWidth = width - (chartMargins[1] + chartMargins[3]),
        chartHeight = height - (chartMargins[0] + chartMargins[2]);

    var minY = 55;
    var maxY = 85;


    // translate the actual x data into the pixel space of the DOM
    var x = d3.scale.ordinal()
        .domain(months)
        .rangePoints([0, chartWidth]);

    // translate the actual y data into the pixel space of the DOM
    var y = d3.scale.linear()
        .domain([minY, maxY])
        .range([chartHeight,0]);

    // setup the x-axis notation
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // setup the y-axis notation
    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(width - (axisMargins[1] + axisMargins[3]))
        .orient("right");

    function customAxis(g) {
      g.selectAll("text")
          .attr("x", 0)
          .attr("y", 2);
    }

    // create the individual points for the line
    var line = d3.svg.line()
        .x(function(d,i) { return x(i); })
        .y(function(d) { return y(d); });    

    // adds SVG element to DOM, positioning properly
    var svg = d3.selectAll(".kpis .chart").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(0,0)");


    // append the notation for x-axis to the DOM and position
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + chartMargins[1] + "," + (chartHeight + chartMargins[0]) + ")")
        .call(xAxis);

    // append the notation for y-axis to the DOM and position
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0," + axisMargins[0] + ")")
        .call(yAxis)
        .call(customAxis)
        .selectAll(".tick line")
            .attr("transform", "translate(" + axisMargins[1] + ",0)");
        
    // append the lines
    var lines = svg.append("g")
        .attr("class", "lines")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .attr("transform", "translate(" + chartMargins[1] + "," + chartMargins[0] + ")");

    lines.append("path")
        .data(competitorCost)
        .attr("class", "xeros-line")
        .attr("d", line(competitorCost))
        .transition()
        .delay(500)
                .duration(1500)
                .attr("d", line(xerosCost));

    lines.append("path")
        .data(competitorCost)
        .attr("class", "competitor-line")
        .attr("d", line(competitorCost));
};