			// container_id: id of container without hash mark
			// show_fn: function called when showing a page
			// hide_fn: function called when hiding a page
			function SiidPage(page_id,container_id, show_fn, hide_fn) 
			{
				page_id = page_id
				container_id = container_id;
				show_fn = show_fn;
				hide_fn = hide_fn;

				this.getPageId = function() { return page_id }
				this.getContainerId = function() { return container_id }
				this.show = function() { if(show_fn) { show_fn() } }
				this.hide = function() { if(hide_fn) { hide_fn() } }
			}

			// the page core class that handles all pages
			function PageCore()
			{
				var pages = {};
				var current_page_id = null;

				// register a new page
				this.register = function(siidpage) {
					pages[siidpage.getPageId()] = siidpage;
				}

				// switch to a new page
				this.switchTo = function(page_id)	{
					hidePage(current_page_id)
					showPage(page_id)
				}

				function getPage(page_id)
				{
					return pages[page_id]
				}

				// execute a function fn = function(element) for each link to a certain subpage
				function forAllLinksTo(page_id, fn)
				{
					$.each($('a[href="#'+page_id+'"]'), fn)
				}

				// hide a page
				function hidePage(page_id) {
					if(getPage(page_id) {
						// hide the container
						$("#"+ getPage(page_id).getContainerId() ).css("visibility","none")
						// execute the hide function hook
						getPage(page_id).hide()
						// update links
						forAllLinksTo(page_id, function(e) { e.removeClass('active') })
						current_page_id = null;
					}
				}

				// show a page
				function showPage(page_id) {
					if(getPage(page_id) {
						// execute the show function hook
						getPage(page_id).show()
						// update links
						forAllLinksTo(page_id, function(e) { e.addClass('active') })
						// show the container
						$("#"+ getPage(page_id).getContainerId() ).css("visibility","block")
						current_page_id = page_id;
					}
				}

			}

			// resize all display areas to a 0.5 aspect	
			function resizeDisplayAreas() {
				var display_area_aspect = 0.5;

				$(".display-area").each( function() {
					$(this).css("min-height", $(this).width() * display_area_aspect);
				})
			}

			var pagecore = new PageCore();
			var hash = window.location.hash;

			window.onload = function() {
				siid_start();

				$(window).resize( resizeDisplayAreas );
				resizeDisplayAreas();

				pagecore.register(
					new SiidPage(
						"power",
						"visibility-container-power",
						null, null
					)
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
