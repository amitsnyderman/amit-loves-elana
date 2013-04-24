define(['jquery', 'gmaps'], function($, maps) {
	var App = function() {
		this.position = new maps.LatLng(40.685, -73.9764);
	};

	App.prototype = {
		run: function() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition($.proxy(this.init, this), null);
			} else {
				this.init(this.position);
			}
		},

		init: function(position) {
			if (position) {
				this.position = new maps.LatLng(position.coords.latitude, position.coords.longitude);
			}

			this.$el = $('#map');
			this.map = new maps.Map(this.$el.get(0), {
				center: this.position,
				zoom: 14,
				mapTypeId: maps.MapTypeId.ROADMAP,
				scrollwheel: false,
				disableDefaultUI: true,
				zoomControl: true,
				zoomControlOptions: {
					style: maps.ZoomControlStyle.SMALL,
					position: maps.ControlPosition.TOP_RIGHT
				}
			});

			this.geocoder = new maps.Geocoder();
			this.placesService = new maps.places.PlacesService(this.map);
			this.directionsService = new maps.DirectionsService();

			this.directionsDisplay = new maps.DirectionsRenderer();
			this.directionsDisplay.setMap(this.map);
			// this.directionsDisplay.setPanel(document.getElementById("directionsPanel"));

			this.transitLayer = new maps.TransitLayer();
			this.transitLayer.setMap(this.map);

			$('li > strong').on('click', $.proxy(this.showMarker, this));
			$('address').on('click', $.proxy(this.getDirections, this));
		},

		showMarker: function(ev) {
			var self = this,
				$target = $(ev.currentTarget),
				$address = $target.siblings('address');

			var request = {
				'address': $address.text()
			};

			this.geocoder.geocode(request, function(results, status) {
				if (status == maps.GeocoderStatus.OK) {
					var place = results[0];
					self.map.setCenter(place.geometry.location);
					var marker = new google.maps.Marker({
						map: self.map,
						position: place.geometry.location
					});
				} else {
					console.log(status);
				}
			});
		},

		getDirections: function(ev) {
			var self = this,
				$target = $(ev.currentTarget),
				start = self.position,
				destination = $target.text();

			var request = {
				origin: start,
				destination: destination,
				travelMode: maps.TravelMode.DRIVING
			};

			this.directionsService.route(request, function(result, status) {
				if (status == maps.DirectionsStatus.OK) {
					self.directionsDisplay.setDirections(result);
				} else {
					console.log(status);
				}
			});
		}
	};

	return App;
});