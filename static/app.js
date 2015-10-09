var spaces, infowindow;

spaces = [
  	['Park view', 32.095559, 34.785096,
		65, 'cont/DSC_1016.JPG'
	],
  	['TLV port', 32.098176, 34.775998,
		80, 'images/loc_ico.png'
	],
  	['Close to train station', 32.085269, 34.793979,
		75, 'images/loc_ico.png'
	]
  ];
 
window.initMap = function() {
	map = new google.maps.Map(document.getElementById('gmap'), {
  		zoom: 15
  	});
  	setMarkers(map);
  	if (navigator.geolocation) {
  		navigator.geolocation.getCurrentPosition(function(position) {
  			var initialLocation;
  			initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  			return map.setCenter(initialLocation);
  		})
	}

	window.infowindow = new google.maps.InfoWindow({
		content: '',
		maxWidth: 200
	});

};


  window.setMarkers = function(map) {
  	var space, i, image, marker, shape;
  	image = {
  		url: 'images/loc_ico.png',
  		size: new google.maps.Size(20, 24),
  		origin: new google.maps.Point(0, 0),
  		anchor: new google.maps.Point(0, 32)
  	};
  	__shape = {
  		coords: [1, 1, 1, 20, 18, 20, 18, 1],
  		type: 'poly'
  	};
  	
  	for (i = 0; i < spaces.length; i++) {
  		space = spaces[i];
  		marker = new google.maps.Marker({
  			position: {
  				lat: space[1],
  				lng: space[2]
  			},
  			map: map,
  			icon: image,
  			shape: shape,
  			title: space[0],
  			cont: space,
  			//zIndex: space[3]
  		});

  		marker.addListener('click', function() {
			infowindow.setContent(
				'<h2 id="firstHeading" class="firstHeading">' + this.cont[0] + '</h2>' +
				'<div id="bodyContent">' +
					'<p><img src="' + this.cont[4] + '" width="100%" heigh="auto"></p>' +
					'<p><b>$' + this.cont[3] + '</b></p>' +
					'<p><form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top"><input type="hidden" name="cmd" value="_xclick"><input type="hidden" name="business" value="BS9Y4C67JFVHU"><input type="hidden" name="lc" value="AU"><input type="hidden" name="item_name" value="DeskNOW"><input type="hidden" name="amount" value="50.00"><input type="hidden" name="currency_code" value="AUD"><input type="hidden" name="button_subtype" value="services"><input type="hidden" name="bn" value="PP-BuyNowBF:btn_buynowCC_LG.gif:NonHosted"><input type="image" src="https://www.paypalobjects.com/en_AU/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal — The safer, easier way to pay online."><img alt="" border="0" src="https://www.paypalobjects.com/en_AU/i/scr/pixel.gif" width="1" height="1"></form></p>' +
				'</div>');
			infowindow.open(map, this);
			map.setCenter(this.getPosition());
  		});
  		
  	}
  };