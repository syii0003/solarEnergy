var drawingManager;
var selectedShape;
var colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00'];
var selectedColor;
var colorButtons = {};
var total_area = 0;
var area = 0;
var no_panels = 0;

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
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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
      console.log(dist)

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
              // console.log(min_elem);
              document.getElementById("sdetails").innerHTML = min_elem['station_no'] + ", " + min_elem['station_name'];
              document.getElementById("sdist").innerHTML = min_elem['dist'].toFixed(2) + " Km";
            });
        }).catch(error => console.error('Error:', error));


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
      }
  });

  google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
  google.maps.event.addListener(map, 'click', clearSelection);
  google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);

  buildColorPalette();

}
