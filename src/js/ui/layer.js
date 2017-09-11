(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.ui) {
		gtris.ui = window.gtris.ui = {};
	}

	var layer = {

		isHasCnt : false,

		open: function(obj) {
			var _obj = obj;
			this.addEvent(_obj);
		},

		loadLayer: function(_obj) {
			var $target = $(_obj.target);
			var url;

			if(_obj.id === undefined) {
				url = _obj.url;
			}else{
				url = _obj.url + '\u0020' + _obj.id;
			}

			//check loaded
			if( $target.find('.gt-layer-content').hasClass('gt-active') ) {
				this.isHasCnt = true;
			}else{
				this.isHasCnt = false;
			}

			//load
			if(this.isHasCnt === false) {
				//create gt-layer-content
				var $cnt = $(document.createElement('div'));
				$cnt.addClass('gt-layer-content');
				$cnt.appendTo($target);

				$cnt.load( url, function( response, status, xhr ) {
					if ( status == "success" ) {
						$cnt.addClass('gt-active');
						$cnt.find('[data-layer="hide"]').on('click', {cnt: $(this), obj: _obj}, layer.hideLayer);
						if(_obj.completed) return _obj.completed();
					}
				});
			}
		},

		hideLayer: function(event) {
			event.stopPropagation();
			var $thisCnt = event.data.cnt;
			var _obj = event.data.obj;
			$thisCnt.remove();
			this.isHasCnt = false;
			if(_obj.closed) return _obj.closed();
		},

		addEvent: function(_obj) {
			layer.loadLayer(_obj);
		}

	};

	gtris.ui.layer = layer;
	
})(window.gtris);
