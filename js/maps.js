var drawingManager;
var selectedShape;
var colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
var selectedColor;
var colorButtons = {};
var total_area = 0;
var area = 0;
var no_panels = 0;

function openForm(){
  document.getElementById("formContainer").style.display = "block";
}

function futureSavings(){
  document.getElementById("savingRow").style.display = "flex";
  var annualDay = document.getElementById("annualtext").innerHTML;
  var trees = calculateTrees(annualDay);
  var cars = calculateCars(annualDay);
  var litresLow = calculateWater(annualDay,11);
  // var litresHigh = calculateWater(annualDay,90)
  document.getElementById("tree").innerHTML = trees + " trees";
  document.getElementById("car").innerHTML = cars + " km";
  document.getElementById("water").innerHTML = litresLow + " litres";
}

function calculateTrees(annualDay){
  var trees = 0;
  trees = (annualDay * 365 * 2.205)/193;
  return Math.round(trees);
}

function calculateWater(annualDay, val) {
  var litres = 0;
  litres = (annualDay * 365 * val);
  // litres = ((Math.round(annualDay) * 365) * low)/3;
  return Math.round((litres*3.8));
}

function calculateCars(annualDay) {
  var kms = 0;
  kms = (annualDay * 365 * 2.205)/0.57;
  return Math.round(kms);
}

function displayEnergy() {
  document.getElementById("energyContainer").style.display = "block";
  var station_no = document.getElementById("sno").innerHTML;
  var systype = parseInt(document.getElementById("system").value);
  var syswatt = 0;
  type = parseInt(document.getElementById("system").value);
  var radioButtons = document.getElementsByName("customRadioInline1");
  for (var x = 0; x < radioButtons.length; x ++) {
    if (radioButtons[x].checked) {
     syswatt = parseInt(radioButtons[x].value);
   }
 }
 var estimated_panels = 0;
 estimated_panels = solarPanelEstimator(syswatt, systype);

 // console.log(station_no, systype, syswatt, estimated_panels);

  var url = "https://greenability.ml/api/station/?station_no=" + station_no;
  console.log(url);
  fetch(url).then(function(response) {
    response.json().then(function(records){
      var energy_json = {};

      energy_json['jan'] = 0;
      energy_json['feb'] = 0;
      energy_json['mar'] = 0;
      energy_json['apr'] = 0;
      energy_json['may'] = 0;
      energy_json['jun'] = 0;
      energy_json['jul'] = 0;
      energy_json['aug'] = 0;
      energy_json['sep'] = 0;
      energy_json['oct'] = 0;
      energy_json['nov'] = 0;
      energy_json['dec'] = 0;
      energy_json['annual'] = 0;

      console.log(records.length);

      records.forEach(function(record){
        energy_json['jan'] += record['jan'];
        energy_json['feb'] += record['feb'];
        energy_json['mar'] += record['mar'];
        energy_json['apr'] += record['apr'];
        energy_json['may'] += record['may'];
        energy_json['jun'] += record['jun'];
        energy_json['jul'] += record['jul'];
        energy_json['aug'] += record['aug'];
        energy_json['sep'] += record['sep'];
        energy_json['oct'] += record['oct'];
        energy_json['nov'] += record['nov'];
        energy_json['dec'] += record['dec'];
        energy_json['annual'] += record['annual'];
      });

      for (var key in energy_json){
        energy_json[key] = energy_json[key]/30;
        energy_json[key] = energyCalculator(syswatt, estimated_panels, energy_json[key]);
      }

      var max_key = Object.keys(energy_json).reduce((a, b) => energy_json[a] > energy_json[b] ? a : b);
      var min_key = Object.keys(energy_json).reduce((a, b) => energy_json[a] < energy_json[b] ? a : b);
      var max_val = 0.00;
      var min_val = 0.00;
      max_val = energy_json[max_key];
      min_val = energy_json[min_key];

      var opacity_json = {};
      for(var key in energy_json) {
        opacity_json[key] = opacityCalculator(energy_json[key], max_val, min_val);
      }

      for(var key in opacity_json) {
        var key_text = key+'text';
        document.getElementById(key).style.opacity = opacity_json[key];
        // document.getElementById(key).title = energy_json[key].toFixed(1)+" kWh/day";
        document.getElementById(key_text).innerHTML = energy_json[key].toFixed(1);
        // document.getElementById(key).data-placement = 'right';
      }

      // $(function () {
      //   $(".monthcard").hover(function() {
      //     var month = $(this).find("p").text();
      //     <!-- compare the month value and append the value inside span via value  -->
      //     <!-- 123 is now a text value, you can declare one variable and get wattage from former generated append -->
      //     $(this).append("<span class='bulb-text'>123</span>");
      //   },function() {
      //     $(".bulb-text").remove();
      //   });
      // })

    });
  }).catch(error => console.error('Error:', error));
}

function opacityCalculator(val, max, min) {
  var n = 0.00;
  // console.log(val, max, min);
  // n = Number(((val - min)/ (max-min)).toFixed(1));
  n = Number((((val - min) * (1 - 0.2)) / (max-min)) + 0.2)
  console.log(typeof n);
  return n;
}

function energyCalculator(syswatt, estimated_panels, radiance) {
  var energy = 0;
  var eff = 0.00;

  // console.log(syswatt);

  if (syswatt == 250) {
    eff = 0.14;
  } else if (syswatt == 300) {
    eff = 0.18;
  } else {
    eff=0.22;
  }

  // console.log(eff);

  energy = estimated_panels * 1.7 * eff * radiance * 0.9;
  return energy;
}

function formValues() {
  // console.log(Math.round(no_panels));
  // document.getElementById("formpanels").disabled = true;
  var value = 0;
  var type = 0;
  type = parseInt(document.getElementById("system").value);
  var radioButtons = document.getElementsByName("customRadioInline1");
  for (var x = 0; x < radioButtons.length; x ++) {
    if (radioButtons[x].checked) {
     value = parseInt(radioButtons[x].value);
   }
 }
 var estimated_panels = 0;
 estimated_panels = solarPanelEstimator(value, type);

 if(estimated_panels <= no_panels){
   document.getElementById("solarpanels").style.display = "flex";
   document.getElementById("systemtype").innerHTML= "For a " + type + "KW System";
   document.getElementById("systemwatt").innerHTML= "You need";
   document.getElementById("systemwatt").style.color="black";
   document.getElementById("systempanels").innerHTML= estimated_panels + " x " + value + "W";
   document.getElementById("normalsolartext").innerHTML= "solar panels";
 }else {
   document.getElementById("systemtype").innerHTML= "For a " + type + "KW System";
   document.getElementById("solarpanels").style.display = "flex";
   document.getElementById("systemwatt").innerHTML= "Roof size not enough for fitting the panels";
   document.getElementById("systemwatt").style.color="red";
   document.getElementById("systempanels").innerHTML="";
   document.getElementById("normalsolartext").innerHTML="";
 }

 window.location.href = '#panelContainer';
}

function recForm() {

  var percentage = 0;
  percentage = parseInt(document.getElementById("dayuse").value);
  var e = document.getElementById("persons");
  var persons = e.options[e.selectedIndex].value;
  console.log(percentage, persons);
  if(persons != "" && no_panels == 0){
    document.getElementById("recpanels").style.display = "flex";
    document.getElementById("recsystemtype").innerHTML= "Change your polygon";
    document.getElementById("recsystemwatt").innerHTML= "";
    document.getElementById("recsystempanels").style.color="red";
    document.getElementById("recnormalsolartext").style.color="red";
    document.getElementById("recsystempanels").innerHTML= "You dont have enough roof size to fit panels";
    document.getElementById("recnormalsolartext").innerHTML= "";
  }
  else if(persons != "" && percentage == 0){
    document.getElementById("recpanels").style.display = "flex";
    document.getElementById("recsystemtype").innerHTML= "";
    document.getElementById("recsystemwatt").innerHTML= "";
    document.getElementById("recsystempanels").style.color="red";
    document.getElementById("recnormalsolartext").style.color="red";
    document.getElementById("recsystempanels").innerHTML= "You dont need a solar panel system for the house";
    document.getElementById("recnormalsolartext").innerHTML= "";
  }
  else if(persons != "" && persons == "1"){
    if(percentage >= 50){
      document.getElementById("recpanels").style.display = "flex";
      document.getElementById("recsystemtype").innerHTML= "We recommend " + "2" + "KW System";
      document.getElementById("recsystemwatt").style.color="black";
      var estimated_panels = solarPanelEstimator(330, 2);
      if(estimated_panels <= no_panels){
        document.getElementById("recsystemwatt").innerHTML= "You need";
        document.getElementById("recsystempanels").style.color="black";
        document.getElementById("recnormalsolartext").style.color="black";
        document.getElementById("recsystempanels").innerHTML= estimated_panels + " x " + "330" + "W";
        document.getElementById("recnormalsolartext").innerHTML= "solar panels";
      } else {
      document.getElementById("recsystemwatt").innerHTML= "";
      document.getElementById("recsystempanels").style.color="red";
      document.getElementById("recnormalsolartext").style.color="red";
      document.getElementById("recsystempanels").innerHTML= "You dont have enough roof size to fit panels";
      document.getElementById("recnormalsolartext").innerHTML= "";
      }
    } else {
      document.getElementById("recpanels").style.display = "flex";
      document.getElementById("recsystemtype").innerHTML= "We recommend " + "1" + "KW System";
      document.getElementById("recsystemwatt").style.color="black";
      var estimated_panels = solarPanelEstimator(330, 1);
      if(estimated_panels <= no_panels){
        document.getElementById("recsystemwatt").innerHTML= "You need";
        document.getElementById("recsystempanels").style.color="black";
        document.getElementById("recnormalsolartext").style.color="black";
        document.getElementById("recsystempanels").innerHTML= estimated_panels + " x " + "330" + "W";
        document.getElementById("recnormalsolartext").innerHTML= "solar panels";
      } else {
      document.getElementById("recsystemwatt").innerHTML= "";
      document.getElementById("recsystempanels").style.color="red";
      document.getElementById("recnormalsolartext").style.color="red";
      document.getElementById("recsystempanels").innerHTML= "You dont have enough roof size to fit panels"
      document.getElementById("recnormalsolartext").innerHTML= "";
      }
    }
  } else if(persons != "" && persons == "2"){
    if(percentage >= 50){
      document.getElementById("recpanels").style.display = "flex";
      document.getElementById("recsystemtype").innerHTML= "We recommend " + "4" + "KW System";
      document.getElementById("recsystemwatt").style.color="black";
      var estimated_panels = solarPanelEstimator(330, 4);
      if(estimated_panels <= no_panels){
        document.getElementById("recsystemwatt").innerHTML= "You need";
        document.getElementById("recsystempanels").style.color="black";
        document.getElementById("recnormalsolartext").style.color="black";
        document.getElementById("recsystempanels").innerHTML= estimated_panels + " x " + "330" + "W";
        document.getElementById("recnormalsolartext").innerHTML= "solar panels";
      } else {
      document.getElementById("recsystemwatt").innerHTML= "";
      document.getElementById("recsystempanels").style.color="red";
      document.getElementById("recnormalsolartext").style.color="red";
      document.getElementById("recsystempanels").innerHTML= "You dont have enough roof size to fit panels";
      document.getElementById("recnormalsolartext").innerHTML= "";
      }
    } else {
      document.getElementById("recpanels").style.display = "flex";
      document.getElementById("recsystemtype").innerHTML= "We recommend " + "3" + "KW System";
      document.getElementById("recsystemwatt").style.color="black";
      var estimated_panels = solarPanelEstimator(330, 3);
      if(estimated_panels <= no_panels){
        document.getElementById("recsystemwatt").innerHTML= "You need";
        document.getElementById("recsystempanels").style.color="black";
        document.getElementById("recnormalsolartext").style.color="black";
        document.getElementById("recsystempanels").innerHTML= estimated_panels + " x " + "330" + "W";
        document.getElementById("recnormalsolartext").innerHTML= "solar panels";
      } else {
      document.getElementById("recsystemwatt").innerHTML= "";
      document.getElementById("recsystempanels").style.color="red";
      document.getElementById("recnormalsolartext").style.color="red";
      document.getElementById("recsystempanels").innerHTML= "You dont have enough roof size to fit panels"
      document.getElementById("recnormalsolartext").innerHTML= "";
      }
    }
  }else {
    if(percentage >= 50){
      document.getElementById("recpanels").style.display = "flex";
      document.getElementById("recsystemtype").innerHTML= "We recommend " + "7" + "KW System";
      document.getElementById("recsystemwatt").style.color="black";
      var estimated_panels = solarPanelEstimator(330, 7);
      if(estimated_panels <= no_panels){
        document.getElementById("recsystemwatt").innerHTML= "You need";
        document.getElementById("recsystempanels").style.color="black";
        document.getElementById("recnormalsolartext").style.color="black";
        document.getElementById("recsystempanels").innerHTML= estimated_panels + " x " + "330" + "W";
        document.getElementById("recnormalsolartext").innerHTML= "solar panels";
      } else {
      document.getElementById("recsystemwatt").innerHTML= "";
      document.getElementById("recsystempanels").style.color="red";
      document.getElementById("recnormalsolartext").style.color="red";
      document.getElementById("recsystempanels").innerHTML= "You dont have enough roof size to fit panels";
      document.getElementById("recnormalsolartext").innerHTML= "";
      }
    } else {
      document.getElementById("recpanels").style.display = "flex";
      document.getElementById("recsystemtype").innerHTML= "We recommend " + "5" + "KW System";
      document.getElementById("recsystemwatt").style.color="black";
      var estimated_panels = solarPanelEstimator(330, 5);
      if(estimated_panels <= no_panels){
        document.getElementById("recsystemwatt").innerHTML= "You need";
        document.getElementById("recsystempanels").style.color="black";
        document.getElementById("recnormalsolartext").style.color="black";
        document.getElementById("recsystempanels").innerHTML= estimated_panels + " x " + "330" + "W";
        document.getElementById("recnormalsolartext").innerHTML= "solar panels";
      } else {
      document.getElementById("recsystemwatt").innerHTML= "";
      document.getElementById("recsystempanels").style.color="red";
      document.getElementById("recnormalsolartext").style.color="red";
      document.getElementById("recsystempanels").innerHTML= "You dont have enough roof size to fit panels"
      document.getElementById("recnormalsolartext").innerHTML= "";
      }
    }
  }

  window.location.href = '#recPanelContainer';
}

function solarPanelEstimator(value,type) {
  var panels = 0;
  panels = Math.round((type *1000)/value);
  return panels;
}

function sliderChange() {
  document.getElementById("slidertext").placeholder=parseInt(document.getElementById("system").value) + "KW";
  document.getElementById("solarpanels").style.display = "none";
  document.getElementById("energyContainer").style.display = "none";
  document.getElementById("savingRow").style.display = "none";
}

function daysliderChange() {
  document.getElementById("usetext").placeholder=parseInt(document.getElementById("dayuse").value) + "%";
  document.getElementById("recpanels").style.display = "none";
  document.getElementById("formContainer").style.display = "none";
  document.getElementById("solarpanels").style.display = "none";
  document.getElementById("energyContainer").style.display = "none";
  document.getElementById("savingRow").style.display = "none";
}

function radioChange() {
  // document.getElementById("slidertext").placeholder=parseInt(document.getElementById("system").value) + "KW";
  document.getElementById("solarpanels").style.display = "none";
  document.getElementById("energyContainer").style.display = "none";
  document.getElementById("savingRow").style.display = "none";
}

function dropDownChange(){
  document.getElementById("recpanels").style.display = "none";
  document.getElementById("formContainer").style.display = "none";
  document.getElementById("solarpanels").style.display = "none";
  document.getElementById("energyContainer").style.display = "none";
  document.getElementById("savingRow").style.display = "none";
}

function clearSelection () {
  if (selectedShape) {
      if (selectedShape.type !== 'marker') {
          selectedShape.setEditable(false);
      }

      selectedShape = null;
  }
}

function setSelection (shape) {
  if (shape.type !== 'marker') {
      clearSelection();
      shape.setEditable(true);
      selectColor(shape.get('fillColor') || shape.get('strokeColor'));
  }
  selectedShape = shape;
  google.maps.event.addListener(shape.getPath(), 'set_at', calcar);
  google.maps.event.addListener(shape.getPath(), 'insert_at', calcar);
}

function calcar() {
    document.getElementById("recpanels").style.display = "none";
    document.getElementById("formContainer").style.display = "none";
    document.getElementById("solarpanels").style.display = "none";
    document.getElementById("energyContainer").style.display = "none";
    document.getElementById("savingRow").style.display = "none";
    var area = google.maps.geometry.spherical.computeArea(selectedShape.getPath());
    total_area = area;
    no_panels = total_area / 1.7;
    document.getElementById("area").innerHTML = Math.round(total_area);
    document.getElementById("panel").innerHTML = Math.round(no_panels);
}

function deleteSelectedShape () {
    if (selectedShape) {
      area = google.maps.geometry.spherical.computeArea(selectedShape.getPath());
      total_area = total_area - area;
      no_panels = total_area / 1.7;
      document.getElementById("area").innerHTML = Math.round(total_area);
      document.getElementById("panel").innerHTML = Math.round(no_panels);

      selectedShape.setMap(null);
      selectedShape = null;
      document.getElementById('pac-input').readOnly = false;
      document.getElementById('pac-input').title = "";
      drawingManager.setOptions({
        drawingControl: true
      });
    }
}

function selectColor (color) {
  selectedColor = color;
  for (var i = 0; i < colors.length; ++i) {
      var currColor = colors[i];
      colorButtons[currColor].style.border = currColor == color ? '2px solid #789' : '2px solid #fff';
  }

    // Retrieves the current options from the drawing manager and replaces the
    // stroke or fill color as appropriate.
    var polylineOptions = drawingManager.get('polylineOptions');
    polylineOptions.strokeColor = color;
    drawingManager.set('polylineOptions', polylineOptions);

    var rectangleOptions = drawingManager.get('rectangleOptions');
    rectangleOptions.fillColor = color;
    drawingManager.set('rectangleOptions', rectangleOptions);

    var circleOptions = drawingManager.get('circleOptions');
    circleOptions.fillColor = color;
    drawingManager.set('circleOptions', circleOptions);

    var polygonOptions = drawingManager.get('polygonOptions');
    polygonOptions.fillColor = color;
    drawingManager.set('polygonOptions', polygonOptions);
}

function setSelectedShapeColor (color) {
  if (selectedShape) {
      if (selectedShape.type == google.maps.drawing.OverlayType.POLYLINE) {
          selectedShape.set('strokeColor', color);
      } else {
          selectedShape.set('fillColor', color);
      }
  }
}

function makeColorButton (color) {
    var button = document.createElement('span');
    button.className = 'color-button';
    button.style.backgroundColor = color;
    google.maps.event.addDomListener(button, 'click', function () {
        selectColor(color);
        setSelectedShapeColor(color);
    });

    return button;
}

function buildColorPalette () {
  var colorPalette = document.getElementById('color-palette');
  for (var i = 0; i < colors.length; ++i) {
      var currColor = colors[i];
      var colorButton = makeColorButton(currColor);
      colorPalette.appendChild(colorButton);
      colorButtons[currColor] = colorButton;
  }
  selectColor(colors[0]);
}

function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -37.8136, lng: 144.9631},
    zoom: 8,
    mapTypeId: 'hybrid',
    mapTypeControl: false,
    fullscreenControl: false
  });


  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
  var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    document.getElementById("mapContainer").style.display="flex";
    document.getElementById("recpanels").style.display = "none";
    document.getElementById("formContainer").style.display = "none";
    document.getElementById("solarpanels").style.display = "none";
    document.getElementById("userdetails").style.display = "none";
    document.getElementById("recContainer").style.display = "none";
    document.getElementById("energyContainer").style.display = "none";
    document.getElementById("savingRow").style.display = "none";

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();

    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      var location = place.geometry.location;
      var lat = location.lat();
      var lng = location.lng();

      var dist = distance(lat, lng, -37.8136, 144.9631, 'K');
      // console.log(dist)

      fetch('https://greenability.ml/api/stations')
        .then(function(response) {
            response.json().then(function(stations) {
              var new_arr = [];
              stations.forEach(function(station) {
                var dict = {};
                dict['station_no'] = station['station_no'];
                dict['station_name'] = station['station_name'];
                dict['dist'] = distance(lat, lng, station['lat'],station['long'],'K');
                new_arr.push(dict);
              });
              // console.log(new_arr);
              var min_elem = {};
              min_elem = new_arr.reduce(function(prev, curr) {
                return prev.dist < curr.dist ? prev : curr;
              });
              // station_no = min_elem['station_no'];
              document.getElementById("sno").innerHTML = min_elem['station_no'];
              document.getElementById("sdetails").innerHTML = min_elem['station_name'];
              document.getElementById("sdist").innerHTML = min_elem['dist'].toFixed(2) + " Km";
            });
        }).catch(error => console.error('Error:', error));

      // console.log(station_no);

      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

  var polyOptions = {
      strokeWeight: 0,
      fillOpacity: 0.45,
      editable: true,
      draggable: true,
  };

  drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon']
      },
      markerOptions: {
          draggable: true
      },
      polylineOptions: {
          editable: true,
          draggable: true
      },
      rectangleOptions: polyOptions,
      circleOptions: polyOptions,
      polygonOptions: polyOptions,
      map: map
  });


  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
      if (e.type != google.maps.drawing.OverlayType.MARKER) {
          // Switch back to non-drawing mode after drawing a shape.
          drawingManager.setDrawingMode(null);

          drawingManager.setOptions({
            drawingControl: false
          });
          var newShape = e.overlay;
          newShape.type = e.type;
          google.maps.event.addListener(newShape, 'click', function() {
              setSelection(newShape);
          });
          var area = google.maps.geometry.spherical.computeArea(newShape.getPath());
          // infowindow.setContent("polygon area=" + area.toFixed(2) + " sq meters");
          // infowindow.setPosition(newShape.getPath().getAt(0));
          total_area = total_area + area;
          no_panels = total_area / 1.7;

          document.getElementById("area").innerHTML = Math.round(total_area);
          document.getElementById("panel").innerHTML = Math.round(no_panels);
          setSelection(newShape);
          document.getElementById("userdetails").style.display = "flex";
          document.getElementById("recContainer").style.display = "block";
          document.getElementById('pac-input').readOnly = true;
          document.getElementById('pac-input').title = "Please delete the shape before changing the address";
          document.getElementById("recpanels").style.display = "none";
          document.getElementById("formContainer").style.display = "none";
          document.getElementById("solarpanels").style.display = "none";
          document.getElementById("energyContainer").style.display = "none";
          document.getElementById("savingRow").style.display = "none";
      }
  });

  google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
  google.maps.event.addListener(map, 'click', clearSelection);
  google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);
  document.getElementById("system").addEventListener("change", sliderChange);
  document.getElementById("dayuse").addEventListener("change", daysliderChange);
  document.getElementById("persons").addEventListener("change",dropDownChange);
  submit.addEventListener("click", formValues);
  recsubmit.addEventListener("click", recForm);
  iniSolar.addEventListener("click", openForm);
  energyButton.addEventListener("click", displayEnergy);
  futureButton.addEventListener("click", futureSavings);
  // document.getElementById('pac-input').tooltip = "disable";

  buildColorPalette();

}
