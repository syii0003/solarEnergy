// hover showing text

$('#game').hover(function(){

  $(this).css({color: "green"});
},
function(){
  $(this).css({color: "lightgreen"});
})

var selected_device_variant = '';

$description = $(".description");

//when the device is hoverd, each device will be shown with the device text
  $('.Devices').hover(function() {

    $(this).attr("class", "Devices");
    $description.addClass('active');

    if (this.id == "fridge") {

        $description.html('Fridge');
    }
    else if (this.id == "ac") {

        $description.html('Air Conditioner');
    }
    else if (this.id == "microwave") {

        $description.html('Oven');
    }
    else if (this.id == "exhaustfan") {

        $description.html('Exhaust Fan');
    }
    else if (this.id == "tv") {

        $description.html('Television');
    }
    else if (this.id == "monitor") {

        $description.html('Monitor');
    }
    else if (this.id == "dryer") {

        $description.html('Dryer');
    }
    else if (this.id == "washer") {

        $description.html('Washer');
    }
    else if(this.id == "dishwasher") {

        $description.html('Dish Washer');
    }



  }, function() {
    $description.removeClass('active');
  });

  $('.Lamp').hover(function() {

// hover on lamp function

    $(this).attr("class", "Lamp");
    $description.addClass('active');
    $description.html($(this).attr('class'));

  }, function() {
    $description.removeClass('active');

  });


$(document).on('mousemove', function(e){
// adjust the hover mouse location on devices
  $description.css({
    left:  e.pageX,
    top:   e.pageY -160
  });

});
//hover part//

//fetch part

$(document).ready(function(){
// ready function used when the page is loaded

//click function when devices are clicked, the energy and annual card will be hid and the hint card will be shown.
  $('.Devices').click(function() {
    $('#energy').hide();
    $('#annualEnergy').hide();
    $('#hintCard').show();

    $(this).attr("class", "Devices");
    $description.addClass('active');
//based on the device name, the hint content will vary
    if (this.id == "fridge") {
      selected_device_variant = 'fridge';
      $('#title').html("Fridge");
      $('#hint').html("Fridge Hints");
      $('#content').html('Ensure the fridge door is closed all time. <br> <br>Adjust the temperature in the fridge based on the outside temperature.  ');
        $description.html('Fridge');
    }
    else if (this.id == "ac") {
      selected_device_variant = 'ac';
      $('#title').html("Air Conditioner");
      $('#hint').html( "Air Conditioner Hints");
      $('#content').html('Use insulate room air conditioners. <br><br> Keep the window closed tightly to avoid the outdoor air getting in. <br><br> Turn the cool level of air conditioner down at night. <br><br> Using the economy mode which will adjust the temperature based on the room.')
        $description.html('Air Conditioner');
    }
    else if (this.id == "microwave") {
      selected_device_variant = 'microwave';
      $('#title').html("Oven");
      $('#hint').html( "Oven Hints");
      $('#content').html('Plan ahead and defrost frozen foods before cooking. <br><br> Ensuring the door of the microwave is closed after use. ');
        $description.html('Oven');
    }
    else if (this.id == "exhaustfan") {
      selected_device_variant = 'exhaustfan';
      $('#title').html("Exhaust Fan");
      $('#hint').html( "Exhaust Fan Hints");
      $('#content').html('Keep the windows of the bathroom open if possible. <br><br> Switch the exhaust fan off, 15 minutes after showering. <br><br> Choosing an Energy Star Certified ventilation fans. ')
        $description.html('Exhaust Fan');
    }
    else if (this.id == "tv") {
      selected_device_variant = 'tv';
      $('#title').html("Television");
      $('#hint').html( "Television Hints");
      $('#content').html('Turn of the switch in the socket when not in use.  <br><br>Turn down the brightness and volume of the television when not needed. ')
        $description.html('Television');
    }
    else if (this.id == "monitor") {
      selected_device_variant = 'monitor';
      $('#title').html("Monitor");
      $('#hint').html( "Monitor Hints");
      $('#content').html('Turn of the switch in the socket when not in use. <br><br>Turn down the brightness and volume of the television when not needed. ')
        $description.html('Monitor');
    }
    else if (this.id == "dryer") {
      selected_device_variant = 'dryer';
      $('#title').html("Dryer");
      $('#hint').html( "Dryer Hints");
      $('#content').html('Keep the dryer timer as per needs. Do not over run the dryer if your clothes are already dried. <br><br>Dry a full load rather than two small loads. ')
        $description.html('Dryer');
    }
    else if (this.id == "washer") {
      selected_device_variant = 'washer';
      $('#title').html("Washer");
      $('#hint').html( "Washer Hints");
      $('#content').html('Wash a full load rather than two small loads. <br><br> Use cold water to wash clothes instead of hot.')
        $description.html('Washer');
    }
    else if(this.id == "dishwasher") {
      selected_device_variant = 'dishwasher';
      $('#title').html("Dish Washer");
      $('#hint').html( "Dish Washer Hints")
      $('#content').html('Wash a full load rather than two small loads. <br><br>Use economy mode to wash the dishes with less water and a lower temperature.')
        $description.html('Dish Washer');
    }


    //getting data using fetch part
    let dropdown = document.getElementById('variant');
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Choose Variant';
    defaultOption.disabled = true;

    //dropdown.add(defaultOption);
    dropdown.selectedIndex = 1;

    let device_name = this.id;
    console.log(device_name);
    //fetch and check the device name to show relative data from the API
    let url = 'https://greenability.ml/api/appliance/?device_name=';
    url = url + device_name;

    console.log(url);

    fetch(url)
      .then(
        function(response) {
          if (response.status !== 200) {
            console.warn('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }

          // Examine the text in the response
          response.json().then(function(data) {
            let option;

        	for (let i = 0; i < data.length; i++) {
              option = document.createElement('option');
          	  option.text = data[i].device_variant;
          	  option.value = data[i].device_variant;
          	  dropdown.add(option);
        	}
          });
        }
      )
      .catch(function(err) {
        console.error('Fetch Error -', err);
      });
  });


  $('.Lamp').click(function() {
    //lamp click function, similar to the devices click function. handling the card hide and show, as well as hint content
    selected_device_variant = 'light';
    $('#energy').hide();
    $('#annualEnergy').hide();
    $('#hintCard').show();

    $('#title').html("Lamp");
    $('#hint').html("Lamp Hints");
    $('#content').html("Use the bulbs with appropriate wattage which suits the size of the room. <br><br>Don't forget to turn off the lights that not being used. ");

    //getting data using fetch part
    let dropdown = document.getElementById('variant');
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Choose Variant';


    //dropdown.add(defaultOption);
    dropdown.selectedIndex = 1;

    const url = 'https://greenability.ml/api/appliance/?device_name=light';
    // fetch the data in API and create variant option for the variant select tag
    fetch(url)
      .then(
        function(response) {
          if (response.status !== 200) {
            console.warn('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }

          // Examine the text in the response
          response.json().then(function(data) {
            let option;

        	for (let i = 0; i < data.length; i++) {
              option = document.createElement('option');
          	  option.text = data[i].device_variant;
          	  option.value = data[i].device_variant;
          	  dropdown.add(option);
        	}
          });
        }
      )
      .catch(function(err) {
        console.error('Fetch Error -', err);
      });
  });
});

//onclick change device color part for each device. can be done in a easier way
$('#monitor').on("click",function() {
  $('#monitor').css({fill: "lightgreen"});
});

$('#tv').on("click",function() {
  $('#tv').css({fill: "lightgreen"});

});

$('#ac').on("click",function() {
  $('#ac').css({fill: "lightgreen"});
});

$('.Lamp').on("click",function() {
  $('.Lamp').css({fill: "lightgreen"});
});

$('#dishwasher').on("click",function() {
  $('#dishwasher').css({fill: "lightgreen"});
});

$('#microwave').on("click",function() {
  $('#microwave').css({fill: "lightgreen"});
});

$('#fridge').on("click",function() {
  $('#fridge').css({fill: "lightgreen"});

});

$('#exhaustfan').on("click",function() {
  $('#exhaustfan').css({fill: "lightgreen"});

});

$('#dryer').on("click",function() {
  $('#dryer').css({fill: "lightgreen"});

});
$('#washer').on("click",function() {
  $('#washer').css({fill: "lightgreen"});

});

$('.Devices').on("click",function() {
  $('.was-validated').show();
})

$('.Lamp').on("click",function() {
  $('.was-validated').show();
})

$('#game').on("click",function() {
  $('#main').show();
  $('#footer').show();
  $('#intro').hide();
})



// submit part by getting the selected value from user and make some response
$('#myForm').submit(function() {
  var device_variant = $('#variant').find(":selected").text();
  var device_name = $('#title').text();
  var hours = $('#hoursValue').val();

  // console.log(device_variant, device_name);

  const url = 'https://greenability.ml/api/appliance/?device_name=' + selected_device_variant + '&device_variant=' + device_variant;
  console.log(url);
  fetch(url)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.warn('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        // Examine the text in the response
        response.json().then(function(data) {
          // console.log(data);
          // $('#energyText').text('100KW');
          for(let i = 0;i < data.length;i++) {
            $('#energyText').text((data[i].energy).toFixed(2) * hours + ' kW');
            $('#costText').text((data[i].energy * hours * 0.282461).toFixed(2) + ' *');
            $('#annualCost').text((data[i].energy * hours * 0.282461 * 365).toFixed(2) + " *");
          }
        });
      }
    )
    .catch(function(err) {
      console.error('Fetch Error -', err);
    });

  $('#energy').show();
  $('#annualEnergy').show();
  $('#hintCard').hide();
  return false;
})

$( "#variant" ).change(function() {
  $('#energy').hide();
  $('#annualEnergy').hide();
});

$( "#hoursValue" ).change(function() {
  $('#energy').hide();
  $('#annualEnergy').hide();
});
