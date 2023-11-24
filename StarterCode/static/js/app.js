// URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Dashboard initialization 
function init() {
  // D3
  d3.json(url).then((data) => {
    // Dropdown menu using select and append 
    const dropdown = d3.select("#selDataset");
    data.names.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });

    // sample ID plots 
    const initialSample = data.names[0];
    buildCharts(initialSample);
    buildMetadata(initialSample);
  });
}

// buildChart function 
function buildCharts(sample) {
  d3.json(url).then((data) => {
    // Get the data 
    const sampleData = data.samples.find((s) => s.id === sample);

    // bar chart
    const barData = [{
      x: sampleData.sample_values.slice(0, 10).reverse(),
      y: sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: sampleData.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    const barLayout = {
      title: "Top 10 OTUs",
    };

    Plotly.newPlot("bar", barData, barLayout);

    // bubble chart
    const bubbleData = [{
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      mode: "markers",
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        colorscale: "Earth"
      },
      text: sampleData.otu_labels
    }];

    const bubbleLayout = {
      title: "OTU Bubble Chart",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// metadata function 
function buildMetadata(sample) {
  d3.json(url).then((data) => {
    const metadata = data.metadata.find((m) => m.id == sample);
    const panel = d3.select("#sample-metadata");

  
    panel.html("");

    // key-value pair
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  });
}

// Function handle dropdown change
function optionChanged(newSample) {
  // Update the charts and metadata
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();