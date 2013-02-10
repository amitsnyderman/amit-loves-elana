require.config({
	paths: {
		jquery: 'jquery/jquery'
	}
});
 
require(['jquery'], function($) {
	var title = (Math.floor(Math.random() * 2))
		? 'Amit ❤’s Elana'
		: 'Elana ❤’s Amit';
	$('title', document).text(title);

	var clicker = window.setTimeout(function() {
		$('.card').trigger('click');
	}, 2000);

	$(document).on('click', '.card', function() {
		window.clearTimeout(clicker);
		$(this).toggleClass('flipped');
	});
});