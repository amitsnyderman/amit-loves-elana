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
			var self = this;

			if (position) {
				this.position = new maps.LatLng(position.coords.latitude, position.coords.longitude);
			}

			this.$el = $('#map');
			this.$body = $('body');
			this.$directions = $('#map-directions');
			this.$locations = $('#map-locations');
			this.$travelMode = this.$directions.find('input');

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
			this.directionsDisplay.setPanel(this.$directions.find('.panel').get(0));
			// this.directionsDisplay.setPanel(document.getElementById("directionsPanel"));

			this.transitLayer = new maps.TransitLayer();
			this.transitLayer.setMap(this.map);

			this.infoWindow = new google.maps.InfoWindow();

			this.$locations.find('li').on('click', $.proxy(this.getDirections, this));
			this.$travelMode.on('change', $.proxy(this.getDirectionsForTravelModel, this));

			maps.event.addListener(map, 'click', function() {
				self.infoWindow.close();
			});

			var here = new google.maps.Marker({
				map: this.map,
				position: this.position,
				title: 'You are here'
			});

			// this.getAllPlaces();
			this.markAllPlaces();
		},

		markAllPlaces: function() {
			var self = this;
			this.$locations.find('li > strong').each(function() {
				self.showMarker({
					currentTarget: $(this)
				});
			});
		},

		showMarker: function(ev) {
			var $target = $(ev.currentTarget),
				$address = $target.siblings('address');

			if ($address.data('lat') && $address.data('lng')) {
				this.createMarker(
					$target.text(),
					$address.text(),
					new maps.LatLng($address.data('lat'), $address.data('lng'))
				);
			} else {
				var request = {
					'address': $address.text()
				};

				this.geocoder.geocode(request, $.proxy(function(results, status) {
					this.createMarker(
						$target.text(),
						$address.text(),
						this.handleGeocode(results, status)
					);
				}, this));
			}
		},

		createMarker: function(title, description, location) {
			var self = this;
			var content = '<div class="info-window"><h4>' + title + '</h4><p>' + description + '</p></div>';
			var marker = new google.maps.Marker({
				map: this.map,
				position: location
			});

			this.map.setCenter(location);

			maps.event.addListener(marker, 'click', function() {
				self.infoWindow.setContent(content);
				self.infoWindow.open(self.map, marker);
			});
		},

		handleGeocode: function(results, status) {
			if (status == maps.GeocoderStatus.OK) {
				var place = results[0];
				return place.geometry.location;
			} else {
				console.log(status);
			}
		},

		getDirections: function(ev) {
			var $target = $(ev.currentTarget),
				origin = this.position,
				destination = $target.find('address').text(),
				mode = this.$travelMode.filter(':checked').val();

			this.selectLocation($target);

			var request = {
				origin: origin,
				destination: destination,
				travelMode: maps.TravelMode[mode]
			};

			this.directionsService.route(request, $.proxy(this.handleDirections, this));
		},

		getDirectionsForTravelModel: function(ev) {
			var $target = $(ev.currentTarget),
				$label = $target.closest('label');

			$label.addClass('selected');
			$label.siblings().removeClass('selected');

			this.getSelectedLocation().trigger('click');
		},

		handleDirections: function(result, status) {
			if (status == maps.DirectionsStatus.OK) {
				this.directionsDisplay.setDirections(result);
				this.$body.addClass('has-directions');
			} else {
				alert('Oops, there was an error getting directions.');
				console.log(status);
			}
		},

		selectLocation: function($target) {
			this.$locations.find('li').removeClass('selected');
			$target.addClass('selected');
		},

		getSelectedLocation: function() {
			return this.$locations.find('.selected');
		},

		getAllPlaces: function() {
			var self = this;

			this.$locations.find('li').each(function() {
				var $el = $(this);
				var $name = $el.find('strong');
				var $address = $el.find('address');

				if ($el.data('id')) {
					return;
				}

				self.placesService.nearbySearch({
					location: self.position,
					radius: '5000',
					name: $name.text()
				}, function(results, status) {
					if (status == google.maps.places.PlacesServiceStatus.OK) {
						console.log(results);
					} else {
						console.log(status);
					}
				});
			});
		}
	};

	return App;
});