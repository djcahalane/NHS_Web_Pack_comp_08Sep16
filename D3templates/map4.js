


var mapw = 500;
var maph = 300;

var xy = d3.geo.equirectangular()
          .scale(100)
          .translate([mapw / 2, maph / 2]);    

var path = d3.geo.path()
    .projection(xy);

var svg = d3.select("#worldMap").insert("svg:svg")
	.attr("width", mapw)
        .attr("height", maph);

var states = svg.append("svg:g")
    .attr("id", "states");

var circles = svg.append("svg:g")
    .attr("id", "circles");

var labels = svg.append("svg:g")
    .attr("id", "labels");

//var color = d3.scale.category20();





var scalefactor=0.1 ;


function updateWorldMap() {



  d3.json("D3templates/world-countries.json", function(collection) {
  states.selectAll("path")
      .data(collection.features)
    .enter().append("svg:path")
      .attr("d", path)
            //.on("mouseover", function(d) {
            //    d3.select(this).style("fill","#6C0")
            //        .append("svg:title")
            //        .text(d.properties.name);})
            //.on("mouseout", function(d) {
            //    d3.select(this).style("fill","#ccc");})
});

  //alert(newData);

d3.csv("D3templates/skill_regions.csv", function(csv) {

    d3.select("#worldMap").selectAll("circle").remove();
    d3.select("#worldMap").selectAll("text").remove();

  var currentSkill=newData;  //newData is the globa vaiable indicating the selected skill
  

  circles.selectAll("circle")
      .data(csv)
    .enter()
    .append("svg:circle")
    .attr("id", "circles")
    .style("fill",function(d) { return color(String(newData)); })
      .attr("cx", function(d, i) { return  xy([+d["longitude"],+d["latitude"]])[0]; })
      .attr("cy", function(d, i) { return  xy([+d["longitude"],+d["latitude"]])[1]; })
      .attr("r",  function(d) { return (+d[currentSkill])*scalefactor; })
      .attr("title",  function(d) { return d["country"]+": "+Math.round(d[currentSkill]); })
           // .on("mouseover", function(d) {
            //    d3.select(this).style("fill","#FC0");})
            //.on("mouseout", function(d) {
            //    d3.select(this).style("fill","dimgray");})
            ;

  labels.selectAll("labels")
      .data(csv)
    .enter()
    .append("svg:text")
        .attr("x", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[0]; })
        .attr("y", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[1]; })
        .attr("dy", "0.3em")
        .attr("text-anchor", "middle")
        .text(function(d) { return Math.round(d[currentSkill]); });

});

};



