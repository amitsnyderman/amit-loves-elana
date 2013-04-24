define(
	["async!http://maps.google.com/maps/api/js?key=AIzaSyAFdytsVsLfzqSLypeRl2_dl3JqoHKm_JA&libraries=places&sensor=true!callback"],
	function() {
		return google.maps;
	}
);