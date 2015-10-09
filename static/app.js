  var spaces, infowindow;

  spaces = [
  	['Park view', 32.098176, 34.775998, 3],
  	['TLV port', 32.095559, 34.785096, 2],
  	['Close to train station', 32.085269, 34.793979, 1]
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
		content: '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' + '<div id="bodyContent">' + '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large </p>' + '</div>',
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
  	shape = {
  		coords: [1, 1, 1, 20, 18, 20, 18, 1],
  		type: 'poly'
  	};
  	i = 0;
  	while (i < spaces.length) {
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
  			zIndex: space[3]
  		});

  		marker.addListener('click', function() {
  			infowindow.content = this.title;
			infowindow.open(map, this);
			map.setCenter(this.getPosition());
  		});
  		i++;
  	}
  };