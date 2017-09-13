(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.ui) {
		gtris.ui = window.gtris.ui = {};
	}

	var indicator = {

		init: function(obj) {
			this.addEvent(obj);
		},

		indicatorClick: function(event) {
			var obj = event.data.obj;
			var $indicator_item = $(obj.target).find('.gt-indicator-item');
			var $this_indicator_item = $(event.target);
			var indicator_index = $this_indicator_item.index();
			
			//add active class
			$indicator_item.removeClass('gt-active');
			$this_indicator_item.addClass('gt-active');

			//return indicatorItemClick
			if(obj.indicatorItemClick) return obj.indicatorItemClick($this_indicator_item, indicator_index);
		},

		addEvent: function(obj) {
			$(obj.target).find('.gt-indicator-item').on('click', {obj: obj}, this.indicatorClick);
		}
	};

	gtris.ui.indicator = indicator;

})(window.gtris);
