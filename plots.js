function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });

      // set the default charts
      buildMetadata(940);
      buildCharts(940);
  })}
  

  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }

  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      console.log("resultArray",resultArray);
      var result = resultArray[0];
      console.log("result",result)
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text(result.location);
      Object.entries(result).forEach(function([key,value]){
        PANEL.append("h6").text(key +":"+ value);
      
    });
  })};

  
  
  
  function buildCharts(sample){
    // access the json file
    d3.json("samples.json").then((data) => {

    var sampleData = data.samples;
    var sampleResultArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    var sampleResult = sampleResultArray[0];
    var topTenValues = (sampleResult.sample_values).slice(0,10).reverse();
    var topTenBacteria = (sampleResult.otu_ids).slice(0,10);
    var stringtopTenBacteria = topTenBacteria.map(id => "OTU"+id);
    var bacteriaLabels = (sampleResult.otu_labels).slice(0,10);
    var metadata = data.metadata;
    var metadataResultArray = metadata.filter(sampleObj => sampleObj.id ==sample)
    var metadataResult = metadataResultArray[0];
    var wfreq = metadataResult.wfreq

    // create bar chart
    var trace1 = {x:topTenValues, y:stringtopTenBacteria, type:"bar", 
    orientation:'h', hovertemplate: '<b>%{text}</b>', text:bacteriaLabels};
    var data1 = [trace1];
    var layout1 = {hoverlabel: { bgcolor: "#fff" }}
    Plotly.newPlot("bar", data1, layout1);

    // create bubble chart
    var otuIds= sampleResult.otu_ids;
    var sampleValues = sampleResult.sample_values;
    var trace2 = {x:otuIds,y:sampleValues, text:bacteriaLabels, mode:"markers", 
    marker:{size:sampleValues, color: otuIds, colorscale:"earth"}};
    var data2 = [trace2];
    var layout2 ={xaxis:{title:"OTU ID"}}
    Plotly.newPlot("bubble", data2, layout2)

    // create the gauge chart

    var trace3 = {
      title: { text: "Belly Button Washing Frequency" },
      type: "indicator",
      value: wfreq,
      mode: "gauge", 
      gauge:{axis:{visible:true,range:[0,10]}}
      // markers: [{type:"area",range:[0,1],"backgroundcolor":"yellow"}]
    };

    var data3 = [trace3]
    var layout3 = { width: 600, height: 400, margin: { t: 0, b: 0 }};
    Plotly.newPlot("gauge", data3, layout3);

  });
}





init();
