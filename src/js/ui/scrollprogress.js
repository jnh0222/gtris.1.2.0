(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.ui) {
		gtris.ui = window.gtris.ui = {};
	}

	var scrollprogress = {

		init: function(obj) {
			if(!obj.height) obj.height = '5px';
			if(!obj.barColor) obj.barColor = '#2598e7';

			//options
			$(obj.target).css('height', obj.height);
			$(obj.target).css('background-color', obj.barColor);
			$(obj.target).css('top', obj.top);
			$(obj.target).css('bottom', obj.bottom);
			
			//add event
			this.addEvent(obj);
		},

		updateProgress: function(event) {
			var obj = event.data.obj;
			var $progress_bar = $(obj.target);
			var scroll_top = $(window).scrollTop(); //current vertical position of the scroll bar
			var bottom_page = $(document).height() - $(window).height(); //(height of HTML document - height of browser viewport)
			var bar_width = scrollprogress.calculatePercent(scroll_top, bottom_page);

			//chagne progress bar
			$progress_bar.css('width',bar_width);
			
			//on progress event
			if(event.data) {
				if(obj.onProgress) return obj.onProgress(bar_width);
			}
		},

		calculatePercent: function(n1, n2) {
			var percent = Math.ceil( n1 / n2 * 100 ) + '%';
			return percent;
		},

		addEvent: function(obj) {
			$(document).on('scroll', {obj: obj}, this.updateProgress);
			$(window).on('resize', {obj: obj}, this.updateProgress);
		}
	};

	gtris.ui.scrollprogress = scrollprogress;

})(window.gtris);
