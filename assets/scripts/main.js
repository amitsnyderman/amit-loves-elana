require.config({
	paths: {
		jquery: 'jquery/jquery',
		async: 'requirejs-plugins/async'
	}
});

require(['jquery'], function($, maps) {
	var title = (Math.floor(Math.random() * 2))
		? 'Amit ❤’s Elana'
		: 'Elana ❤’s Amit';
	$('title', document).text(title);
});