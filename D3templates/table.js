
function updateSkillTable() {




d3.json("D3templates/tableSampleData.json", function(error,jdata0){
    if (error) throw error;

  
           d3.select("#tableDiv").selectAll("table").remove();
        



  var jdata=jdata0[newData];

 //alert(newData)

  
d3.select("#tableDiv").selectAll("table")
    .data([jdata])
  .enter().append("table").attr("class","dataTable")
    .call(recurse);

function recurse(sel) {
  // sel is a d3.selection of one or more empty tables
  sel.each(function(d) {
    // d is an array of objects
    var colnames,
        tds,
        table = d3.select(this);

    // obtain column names by gathering unique key names in all 1st level objects
    // following method emulates a set by using the keys of a d3.map()
    colnames = d                                                          // array of objects
        .reduce(function(p,c) { return p.concat(d3.keys(c)); }, [])       // array with all keynames
        .reduce(function(p,c) { return (p.set(c,0), p); }, d3.map())      // map with unique keynames as keys
        .keys();                                                          // array with unique keynames (arb. order)

    // colnames array is in arbitrary order
    // sort colnames here if required

    // create header row using standard 1D data join and enter()
    table.append("thead").append("tr").selectAll("th")
        .data(colnames)
      .enter().append("th").attr("class","dataTable")
        .text(function(d) { return d; });

    // create the table cells by using nested 2D data join and enter()
    // see also http://bost.ocks.org/mike/nest/
    tds = table.append("tbody").selectAll("tr")
        .data(d)                            // each row gets one object
      .enter().append("tr").attr("class","dataTable").selectAll("td")
        .data(function(d) {                 // each cell gets one value
          return colnames.map(function(k) { // for each colname (i.e. key) find the corresponding value
            return d[k] || "";              // use empty string if key doesn't exist for that object
          });
        })
      .enter().append("td").attr("class","dataTable");

    // cell contents depends on the data bound to the cell
    // fill with text if data is not an Array
    tds.filter(function(d) { return !(d instanceof Array); })
        .text(function(d) { return d; });
    // fill with a new table if data is an Array
    tds.filter(function(d) { return (d instanceof Array); })
        .append("table")
        .call(recurse);
  });
}

})


}