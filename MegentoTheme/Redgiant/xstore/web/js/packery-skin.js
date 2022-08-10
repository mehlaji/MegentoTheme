define(["jquery", "packery"], function ($, packery) {
  	var packery_initalize = function() {
		$('.packery-grid:not(.rendered)').addClass('rendered').each(function(){
			var	$this	= $(this),
			$grid = $this.find('.packery__items');

			// init packery
			window.addEventListener('load', function () {
				setTimeout(function () {
					$grid.packery({
						itemSelector: ".packery__item",
						percentPosition: true
					});
				}, 300);
			});
		});
	};
	window.Packery_skin = {
		init: function() {
			packery_initalize();
		}
 };
});