var rPlot = rPlot || {}

    rPlot.width = 700,
    rPlot.height = 350,
    rPlot.hscalefactor1=150,
    rPlot.hscalefactor2=0;

    rPlot.color = d3.scale.category20();

 rPlot.force = d3.layout.force()
    .charge(-500)
    .linkDistance(50)
    .size([rPlot.width, rPlot.height]);

                    var tipDiv = d3.select("#rPlotDiv").append("div") 
                      .attr("class", "rPlotTooltip")       
                      .style("opacity", 0);

                  var rsvg = d3.select("#rPlotDiv").append("svg")
                      .attr("width", rPlot.width)
                      .attr("height", rPlot.height)
                      .attr("id","rplot");

                  var whichgraph="skill2data";

                  rsvg.append("defs").selectAll("marker")
                      .data(["type1", "type1", "type1"])
                    .enter().append("marker")
                      .attr("id", function(d) { return d; })
                      .attr("viewBox", "0 -5 10 10")
                      .attr("viewBox", "0 -5 10 10")
                      .attr("refX", 20)
                      .attr("refY", 0)
                      .attr("markerWidth", 3)
                      .attr("markerHeight", 3)
                      .attr("orient", "auto")
                    .append("path")
                      .attr("d", "M0,-5L10,0L0,5")
                      .attr("stroke","#999")
                      .attr("fill","#bbb");;





function updateSkillGraph() {



            d3.json("D3templates/skillnet.json", function(error,graph0) {
                            if (error) throw error; 

                          
            d3.select("#rplot").selectAll(".link").remove();
            d3.select("#rplot").selectAll(".node").remove();
            d3.select("#rplot").selectAll(".text").remove();
            d3.select("#rplot").selectAll(".nodeLabel").remove();
            d3.select("#rplot").selectAll(".shadow").remove();

          // alert(newData);

  

              var graph=graph0[newData];
                            
                            rPlot.force
                                .nodes(graph.nodes)
                                .links(graph.links)
                                .start();

                            var link = rsvg.selectAll(".link")
                                .data(graph.links)
                              .enter().append("line")
                                .attr("class", "link")
                                .attr("x1", function(d) { return rPlot.hscalefactor1*d.sourceGroup; })
                                 .attr("x2", function(d) { return rPlot.hscalefactor1*d.targetGroup; })
                                .style("stroke-width", function(d) { return 5 * Math.sqrt(Math.sqrt(d.value)); })
                                .attr("marker-end", "url(#type1)")
                                .style("stroke-opacity", function(d) { return Math.sqrt(d.value); });

                            var node = rsvg.selectAll(".node")
                                .data(graph.nodes)
                              .enter().append("circle")
                                .attr("class", "node")
                                .attr("r", 12)
                                .attr("cx", function(d) { return rPlot.hscalefactor1*d.group; })
                                .style("fill", function(d) { return rPlot.color(d.group); })
                                .call(rPlot.force.drag);
                              


                              var text = rsvg.selectAll(".text")
                                  .data(graph.nodes)
                                .enter().append("text")
                                  .attr("class", "nodeLabel")
                               //  .attr("x", 8)
                              .attr("y", ".31em")
                              .attr("x", function(d) { return rPlot.hscalefactor1*d.group; })
                              //.attr("font-size","15px")
                              //.attr("font-family","sans-serif")
                             // .attr("class","text")
                             .attr("pointer-events","none")
                              .text(function(d) { return d.name; });



                            rPlot.force.on("tick", function() {
                              link.attr("y1", function(d) { return 1*(d.source.y + 0*d.source.x); })
                                  
                                  .attr("y2", function(d) { return 1*(d.target.y + 0*d.target.x); });

                              node.attr("cy", function(d) { return 1*((d.y + 0*d.x)); });
                                 

                              text.attr("y", function(d) { return 1*(d.y + 0*d.x); });

                                }); 



                          node.on('click', connectedNodes)
                              .on("mouseover", function(d) {   
                                    if (d.group == 3){
                                      tipDiv.transition()
                                          .delay(750)    
                                          .duration(300)    
                                          .style("opacity", .9);    
                                      tipDiv.html(d.description) 
                                          .style("left", 100 + "px")     
                                            .style("top", 100 + "px");
                                          //.style("left", d3.select(this).attr("cx") + "px")     
                                           // .style("top", d3.select(this).attr("cy") + "px");
                                          //.style("left", (d3.event.pageX) + "px")   
                                          //.style("top", (d3.event.pageY - 0) + "px");  
                                      }
                                      })          
                                    .on("mouseout", function(d) {   
                                      tipDiv.transition()    
                                          .duration(500)    
                                          .style("opacity", 0); 
                                      });




                              //---Insert-------

                          //Toggle stores whether the highlighting is on
                          var toggle = 0;

                          //Create an array logging what is connected to what
                          var linkedByIndex = {};
                          for (i = 0; i < graph.nodes.length; i++) {
                              linkedByIndex[i + "," + i] = 1;
                          };
                          graph.links.forEach(function (d) {
                              linkedByIndex[d.source.index + "," + d.target.index] = 1;
                          });

                          //This function looks up whether a pair are neighbours  
                          function neighboring(a, b) {
                              return linkedByIndex[a.index + "," + b.index];
                          }

                          function connectedNodes() {

                              if (toggle == 0) {
                                  //Reduce the opacity of all but the neighbouring nodes
                                  d = d3.select(this).node().__data__;
                                  node.style("opacity", function (o) {
                                      return neighboring(d, o) | neighboring(o, d) ? 1 : 0.15;
                                  });
                                  
                                  link.style("opacity", function (o) {
                                      return d.index==o.source.index | d.index==o.target.index ? 1 : 0.15;
                                  });

                                     text.style("opacity", function (o) {
                                      return neighboring(d, o) | neighboring(o, d) ? 1 : 0.25;
                                  });
                                  
                                  //Reduce the op
                                  
                                  toggle = 1;
                              } else {
                                  //Put them back to opacity=1
                                  node.style("opacity", 1);
                                  link.style("opacity", 1);
                                  text.style("opacity", 1);
                                  toggle = 0;
                              }

                          } //end of function connectedNodes
                                  





                }); //end of function callback of d3.json

}; //end update function







//var newData = eval(d3.select(this).property('value'));
//updateSkillGraph(newData);
 var newData="default";
