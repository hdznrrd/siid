var pagecore = new PageCore();
var hash = window.location.hash;

window.onload = function() {
	siid_start();

	$(window).resize( resizeDisplayAreas );
	resizeDisplayAreas();

	pagecore.register(
		new SiidPage("power", "visibility-container-power", null, null),
		new SiidPage("network", "visibility-container-network", null, null),
		new SiidPage("social", "visibility-container-social", null, null),
	)

	// show the first page
	pagecore.switchTo("power")

	// track if the hash url part changes
	setInterval( function() {
		if(hash != window.location.hash) {
			hash = window.location.hash;
			pagecore.switchTo(hash.substr(1));
		}
	}, 1000 )
}
