// helper function to calculate iqr stats
function boxplot_stats(data){
  var killed = data.sort(function(a,b){return Number(a.Killed) - Number(b.Killed)});
  var mu = d3.median(killed, d=>Number(d.Killed));
  var q1 = d3.quantile(killed.map(d=>Number(d.Killed)), 0.25);
  var q3 = d3.quantile(killed.map(d=>Number(d.Killed)), 0.75);
  return {"median": mu, "q1":q1, "q3":q3}
}

function draw_box(g, data, ext, dy, draw, width, height, c){
  // unique list of country
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  };
  var country = data.map(d => d.Country);
  var countryList = country.filter(onlyUnique);
  var countryList = ["Bangladesh","India", "Japan",  "China P Rep", "Philippines","United States"];

  // scale function
  var x = d3.scaleLog().range([0, width]).domain(ext);
  var axis = g.append('g').attr('transform', translate(10,40+dy));

  // insert title
  g.append('text')
  .text("Casualty Distribution")
  .attr("fill", "white")
  .style("text-anchor", "middle")
  .style("alignment-baseline", "hanging")
  .style("font-size", '18px')
  .attr('transform', translate(10+x(500000)/2,-5));

  // log labels to insert
  var label = [100, 500, 1000, 5000, 10000, 50000, 100000, 500000];

  if (draw){
    // draw vertical lines
    axis.selectAll(".axis").data(label)
    .enter()
      .append("line")
        .attr("class","axis")
        .attr("x1", d=> x(d))
        .attr("y1", 5)
        .attr("x2", d => x(d))
        .attr("y2", (height+15)*6+55)
        .style("stroke-width", function(d){
          if (d == 100){
            return "1";
          }
          else{
            return "0.5";
          }
        })
        .style("stroke-opacity", 0.5)
        .style("stroke", "white")
        .style("fill", "none");

    // ticks on top
    axis.selectAll(".ticks").data(label)
    .enter()
      .append('text')
      .attr('class', 'tickes')
      .attr("x", d=> x(d))
      .attr("y", -5)
      .text(d=>d)
      .attr("fill", "white")
      .style("text-anchor", "middle")
      .style("font-size", '10px')
      .style("opacity", 0.7);;

    // ticks on bottom
    axis.selectAll(".ticks").data(label)
    .enter()
      .append('text')
      .attr('class', 'tickes')
      .attr("x", d=> x(d))
      .attr("y", (height+20)*6+40)
      .text(d=>d)
      .attr("fill", "white")
      .style("text-anchor", "middle")
      .style("font-size", '10px')
      .style("opacity", 0.7);;

  };
  // main loop
  countryList.forEach(function(d, i){
    // filter the country
    var filtered = data.filter(function(t){return t.Country == d});
    // find the stats
    var stats = boxplot_stats(filtered);
    var upper = stats.q3 + 1.5 * (stats.q3 - stats.q1);
    var lower = stats.q1 - 1.5 * (stats.q3 - stats.q1);
    // filter outliers
    var outliers = filtered.filter(function(d){
      return d.Killed > upper || d.Killed < lower;
    });
    // create new group
    var pos = g.append('g').attr('transform', translate(10,30 + i*(height+30)));

    // white frame
    // pos.append('rect')
    // .attr("width", width)
    // .attr("height", height+5)
    // .style("fill", 'none')
    // .style("opacity", 0.2)
    // .style("stroke", "white");

    // box plot
    var rect_height = 0.7 * height;
    var center = pos.append('g')
    .attr("id", 'mid')
    .attr('transform', translate(0,5+dy+rect_height/4));

    var ky;
    var kx;

    // draw left half of rect
    center.append('rect')
      .attr("x", x(stats.q1))
      .attr("width", x(stats.median) - x(stats.q1))
      .attr("height", (rect_height/2))
      .attr("stroke-width", 1.5)
      .style("fill", '#333333')
      .style("fill-opacity", 1)
      .style("stroke", c)
      .style("stroke-opacity", 1);

    // draw right half of rect
    center.append('rect')
      .attr("x", x(stats.median))
      .attr("width", x(stats.q3) - x(stats.median))
      .attr("height", (rect_height/2))
      .attr("stroke-width", 1.5)
      .style("fill", '#333333')
      .style("fill-opacity", 1)
      .style("stroke", c)
      .style("stroke-opacity", 1);

    // draw line at 0
    center.append("line")
      .attr("x1", 0)
      .attr("y1", (rect_height/4)-3)
      .attr("x2", 0)
      .attr("y2", (rect_height/4)+3)
      .style("stroke-width", 2)
      .style("stroke", "white")
      .style("fill", "none");

      // draw line from 0 to q1
      center.append("line")
        .attr("x1",0)
        .attr("y1", (rect_height/4))
        .attr("x2", x(stats.q1))
        .attr("y2", (rect_height/4))
        .style("stroke-width", 0.3)
        .style("stroke", "white")
        .style("fill", "none");

      // draw line at 1.5 IQR from q3
      center.append("line")
        .attr("x1", x(stats.q3 + 1.5*(stats.q3 - stats.q1)))
        .attr("y1", (rect_height/4)-3)
        .attr("x2", x(stats.q3 + 1.5*(stats.q3 - stats.q1)))
        .attr("y2", (rect_height/4)+3)
        .style("stroke-width", 2)
        .style("stroke", "white")
        .style("fill", "none");

      // draw line to connect q3 and 1.5 IQR
      center.append("line")
        .attr("x1", x(stats.q3 + 1.5*(stats.q3-stats.q1)))
        .attr("y1", (rect_height/4))
        .attr("x2", x(stats.q3))
        .attr("y2", (rect_height/4))
        .style("stroke-width", 0.3)
        .style("stroke", "white")
        .style("fill", "none");

      // plot outliers
      center.selectAll(".out").data(outliers)
      .enter()
      .append("circle")
        .attr("class", "out")
        .attr("cx", d=>x(Number(d.Killed)))
        .attr("cy", function(){
          return Math.random()*10 + rect_height/4
        })
        .attr("r", function(d){
          if (d.Name == "Katrina"){
            d3.select(this).attr("id", "katrina")
            return 6;
          }
          return 3;
        })
        .attr("fill", function(d){
          if (d.Name == "Katrina"){
            d3.select(this).attr("id", "katrina")
            return "red";
          }
          return "#333333";
        })
        .style("stroke", c)
        .style("stroke-width", 1);

      // draw annotation for katrina
      if (draw && d == "United States"){
        var katrina = g.selectAll("#katrina");
        center.append("line")
          .attr("x1", katrina.attr("cx"))
          .attr("y1", katrina.attr("cy"))
          .attr("x2", (Number(katrina.attr("cx"))+75))
          .attr("y2", (Number(katrina.attr("cy"))-25))
          .style("stroke-width", 0.6)
          .style("stroke", "white")
          .style("fill", "none");

        center.append("rect")
          .attr("x", (Number(katrina.attr("cx"))+80))
          .attr("y", (Number(katrina.attr("cy"))-50))
          .attr("height", 45)
          .attr("width", 70)
          .attr("fill", "#333333")

        center.append("text")
          .text("Katrina")
          .attr("x", (Number(katrina.attr("cx"))+110))
          .attr("y", (Number(katrina.attr("cy"))-40))
          .attr("fill", "white")
          .style("text-anchor", "middle")
          .style("alignment-baseline", "hanging")
          .style("font-size", '14px');

        center.append("text")
          .text("Death : 1833")
          .attr("x", (Number(katrina.attr("cx"))+110))
          .attr("y", (Number(katrina.attr("cy"))-25))
          .attr("fill", "white")
          // .attr("opacity", 0.7)
          .style("text-anchor", "middle")
          .style("alignment-baseline", "hanging")
          .style("font-size", '12px');

      }
  });

}
