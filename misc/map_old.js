// initializing variables
var drawingManager;
var selectedShape;
var colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
var selectedColor;
var colorButtons = {};
var total_area = 0;
var area = 0;
var no_panels = 0;

// function to clear the selected shape
function clearSelection () {
    if (selectedShape) {
        if (selectedShape.type !== 'marker') {
            selectedShape.setEditable(true);
        }
        selectedShape = null;
    }
}

// function to set the selected shape
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

// function to calcuate the roof server area
function calcar() {
    var area = google.maps.geometry.spherical.computeArea(selectedShape.getPath());
    total_area = area;
    no_panels = total_area / 1.7;
    document.getElementById("area").innerHTML = Math.round(total_area);
    document.getElementById("panel").innerHTML = Math.round(no_panels);
}

// function to delete the selected shape
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

//function to select the color of the shape
function selectColor (color) {
    selectedColor = color;
    for (var i = 0; i < colors.length; ++i) {
        var currColor = colors[i];
        colorButtons[currColor].style.border = currColor == color ? '2px solid #789' : '2px solid #fff';
    }

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

//function to chanege the selected shape color
function setSelectedShapeColor (color) {
    if (selectedShape) {
        if (selectedShape.type == google.maps.drawing.OverlayType.POLYLINE) {
            selectedShape.set('strokeColor', color);
        } else {
            selectedShape.set('fillColor', color);
        }
    }
}

//function to initialise color button
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

//function to build the color palette
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


//function to initialise and it will be called when the javascript is initialized
function initialize () {
    var infowindow = new google.maps.InfoWindow();

    var Melbourne_Bounds = {
      north: -10.4121,
      south: -39.0820,
      west: 113.0918,
      east: -153.3814,
    };


    //setting up map variables
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(-37.8136, 144.9631),
        mapTypeId: google.maps.MapTypeId.SATELLITE,


        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        streetViewControl: true,

        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },

        restriction: {
          LatLngBounds: Melbourne_Bounds,
          strictBounds: true,
        },





        // gestureHandling: 'cooperative',
        disableDefaultUI: true,
        zoomControl: true,

    });

    //setting up the polyoptions
    var polyOptions = {
        strokeWeight: 0,
        fillOpacity: 0.45,
        editable: true,
        draggable: true,
    };

    //setting up the drawing manager
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

            // Add an event listener that selects the newly-drawn shape when the user
            // mouses down on it.
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

    var options = {
    componentRestrictions: {country: 'au'}
    };

    //initilaise the places search box
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls.push(input);

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
}
