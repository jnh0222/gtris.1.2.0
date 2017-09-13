(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.ui) {
		gtris.ui = window.gtris.ui = {};
	}

	var layer = {

		isHasLayer : false,

		open: function(obj) {
			this.addEvent(obj);
		},

		loadLayer: function(obj) {
			var $target = $(obj.target);
			var url;

			if(obj.id === undefined) {
				url = obj.url;
			}else{
				url = obj.url + '\u0020' + obj.id;
			}

			//check loaded
			if( $target.find('.gt-layer-content').hasClass('gt-active') ) {
				this.isHasLayer = true;
			}else{
				this.isHasLayer = false;
			}

			//load
			if(this.isHasLayer === false) {
				//create div and addclass
				var $ly_container = $(document.createElement('div'));
				$ly_container.addClass('gt-layer-container');
				$ly_container.appendTo($target);
				$target.addClass('gt-active');

				$ly_container.load(url, function(response, status, xhr) {
					
					if(status === "success") {
						//focusabled string
						var	focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
						var	focusedElementBeforeWindow = $(':focus');
						var o = $ly_container.find('*');
						o.filter(focusableElementsString).filter(':visible').first().focus();

						//hide layer
						$ly_container.find('[data-layer="hide"]').on('click', function(event) {
							event.stopPropagation();
							this.isHasLayer = false;
							focusedElementBeforeWindow.focus();
							$ly_container.remove();
							if(obj.closed) return obj.closed();
						});

						//completed
						if(obj.completed) return obj.completed();
					}
				});
			}
		},

		addEvent: function(obj) {
			layer.loadLayer(obj);
		}

	};

	gtris.ui.layer = layer;
	
})(window.gtris);
