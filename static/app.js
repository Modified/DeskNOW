var spaces, infowindow;
var initialLocation;


spaces = [
  	['Shared room at TLV port', 32.101212, 34.775483,
		65, 'cont/shared desk.jpg'
	],
  	['Conference room with park views', 32.095168, 34.779726,
		80, 'cont/conf-room.jpg'
	],
  	['Private room with large desk, close to train station', 32.085269, 34.793979,
		75, 'cont/desk-space.jpg'
	]
  ];
 
window.initMap = function() {
	map = new google.maps.Map(document.getElementById('gmap'), {
  		zoom: 15
  	});
  	setMarkers(map);
  	if (navigator.geolocation) {
  		navigator.geolocation.getCurrentPosition(function(position) {
  			initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  			return map.setCenter(initialLocation);
  		})
	}

	window.infowindow = new google.maps.InfoWindow({
		content: '',
		maxWidth: 300
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
				'<div id="infowindow_space">' +
				'<h2 id="firstHeading" class="firstHeading">' + this.cont[0] + '</h2>' +
				'<div id="bodyContent">' +
					'<div><img src="' + this.cont[4] + '" width="85%" heigh="auto"></div>' +
					'<div align=left>' + getDistanceKM(initialLocation.lat(), initialLocation.lng(), this.cont[1], this.cont[2]) + ' Km</div>' +
					'<div align=right><b>$' + this.cont[3] + ' / PH</b></div>' +
					'<div><form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top"><input type="hidden" name="cmd" value="_xclick"><input type="hidden" name="business" value="BS9Y4C67JFVHU"><input type="hidden" name="lc" value="AU"><input type="hidden" name="item_name" value="DeskNOW"><input type="hidden" name="amount" value="50.00"><input type="hidden" name="currency_code" value="AUD"><input type="hidden" name="button_subtype" value="services"><input type="hidden" name="bn" value="PP-BuyNowBF:btn_buynowCC_LG.gif:NonHosted"><input type="image" src="https://www.paypalobjects.com/en_AU/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal — The safer, easier way to pay online."><img alt="" border="0" src="https://www.paypalobjects.com/en_AU/i/scr/pixel.gif" width="1" height="1"></form></div>' +
				'</div></div>');
			infowindow.open(map, this);
			map.setCenter(this.getPosition());
  		});
  		
  	}
  };
  

	var rad = function(x) {
		return x * Math.PI / 180;
	};

	var getDistanceKM = function(lat1, lng1, lat2, lng2) {
		var R = 6378137; // Earth’s mean radius in meter
		var dLat = rad(lat2 - lat1);
		var dLong = rad(lng2 - lng1);
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
			Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		return Math.round(d/100)/10; // returns the distance in meter
	};