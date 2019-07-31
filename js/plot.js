fetch('https://greenability.ml/api/annual').then(function(response) {
  response.json().then(function(records){
    console.log(records.length);

    var new_json = {};
    records.forEach(function(record){
      key = record['year'];
      if(!new_json[key]) {
        new_json[key] = 0;
      }

      new_json[key] += record['annual'];
    });

    xval =[];
    yval =[];

    for (var key in new_json){
      new_json[key] = new_json[key]/21;
      xval.push(key);
      yval.push(new_json[key]);
    }

    var solar_exposure = {
      x: xval,
      y: yval,
      mode: 'lines+markers',
      name: 'Scatter and Lines'
    };

    var data = [solar_exposure];

    var layout = {
      title: 'Average daily global solar exposure in KWh',
      xaxis: {
        title: {
          text : 'Years',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#000080'
          }
        },
        range: [1985, 2021],
      },
      yaxis: {
        title: {
          text : 'solar exposure in KWh',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#000080'
          }
        },
        range: [0, 8],
      }
      // xaxis: {range: [1985, 2021]},
      // yaxis: {range: [0, 8]}
    };

    Plotly.newPlot('myDiv', data, layout);

  });
}).catch(error => console.error('Error:', error));
