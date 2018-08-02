// month ticks that is visible on the graph
var month_visible = {
  "Bangladesh" : ["Apr", "Oct"],
  "India" : ["Jul", "Nov"],
  "Japan" : ["Sep"],
  "United States" : ["Sep"],
  "Philippines" : ["Nov"],
  "China P Rep" : ["Jun","Aug"],
}

function draw_trend(g, data, extnt, width, height, l, color){
  // unique list of country
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  };
  var country = data.map(d => d.Country);
  var countryList = country.filter(onlyUnique);
  var countryList = ["Bangladesh","India", "Japan",  "China P Rep", "Philippines","United States"];

  // scaling functions
  var month = Array.apply(null, Array(12)).map(function (_, i) {return i+1;});
  // x and y
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.2).domain(month);
  var y = d3.scaleLinear().rangeRound([height, 0]).domain(d3.extent(extnt));
  // smooth line
  var line = d3.line()
      .curve(d3.curveMonotoneX)
      .x(function(d) { return x(Number(d.Month_start))+x.bandwidth()/2; })
      .y(function(d) { return y(Number(d.Killed_log)); });
  // mean dashed line
  var avg_line = d3.line()
      .x(function(d) { return x(Number(d.Month_start))+x.bandwidth()/2; });
  // thick line at y = 0
  var zero_line = d3.line()
      .x(function(d) { return x(Number(d.Month_start))+x.bandwidth()/2; })
      .y(function(d) { return y(0); });

  // insert title
  g.append('text')
  .text("Seasonal Frequency")
  .attr("fill", "white")
  .style("text-anchor", "middle")
  .style("alignment-baseline", "hanging")
  .style("font-size", '18px')
  .attr('transform', translate(10+50+(width)/2,-5))

  // area under the curve
  var area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(Number(d.Month_start))+x.bandwidth()/2; })
    .y0(height)
    .y1(function(d) { return y(Number(d.Killed_log)); });

  // main loop
  countryList.forEach(function(d, i){
    // filter the country
    var filtered = data.filter(function(t){return t.Country == d});
    // update the mean line function
    avg_line.y(y(10));
    // create new group
    var pos = g.append('g').attr('transform', translate(50,30 + i*(height+30)));

    // white frame
    // pos.append('rect')
    // .attr("width", width)
    // .attr("height", height+5)
    // .style("fill", 'none')
    // .style("opacity", 0.2)
    // .style("stroke", "white");

    // thick line at y = 0
    pos.append("path")
      .datum(filtered)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("d", zero_line);

    // plot circles
    pos.selectAll(".plot").data(filtered)
    .enter()
    .append("circle")
      .attr("class", "plot")
      .attr("cx", function(d) { return x(Number(d.Month_start))+x.bandwidth()/2; })
      .attr("cy", function(d) { return y(Number(d.Killed_log)); })
      .attr("r", 2)
      .style("fill", color)
      .style("opacity", 1);

    // draw a smooth line
    pos.append("path")
      .datum(filtered)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    // draw a reference line at y = 10
    pos.append("path")
      .datum(filtered)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 0.6)
      .style("stroke-dasharray", ("3, 3"))
      .attr("d", avg_line)
      .style("opacity", 0.7);;

    // insert text "10"
    pos.append("text")
      .text(10)
      .attr("transform", translate(30, y(10)-3))
      .attr("fill", "white")
      .style("text-anchor", "middle")
      .style("font-size", '10px')
      .style("opacity", 0.7);

    // if l = true, add
    if(l){
      // insert countries
      pos.append("text")
        .text(d)
        .attr("transform", translate(width+60, y(5)))
        .attr("fill", "white")
        .style("text-anchor", "middle")
        .style("font-size", '16px');

      // month label
      var month_label = ['Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var month_labels = g.append('g').attr('transform', translate(50,20));

      // insert month label at specific points
      month_labels.selectAll(".month_l")
      .data(month_label)
      .enter()
        .append("text")
        .text(d=>d)
        .attr("transform", function(d,t){
          return translate(x(t+1)+x.bandwidth()/2, (i+1)*(height+30)-2);
        })
        .attr("fill", function(t){
          if (month_visible[d].includes(t)){
            return "white"
          }
          else{
            return "none";
          }
        })
        .style("text-anchor", "middle")
        .style("font-size", '10px')
        .style("opacity", 0.7);
    }
  });
}
