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

	$(document).on('click', '.card', function() {
		$(this).toggleClass('flipped');
	});
});