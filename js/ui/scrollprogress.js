(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.ui) {
		gtris.ui = window.gtris.ui = {};
	}

	var scrollprogress = {

		progress_bar: 'progress_bar',

		init: function(obj) {
			if(!obj.height) obj.height = '5px';
			if(!obj.barColor) obj.barColor = '#2598e7';
			this.progress_bar = $(obj.target);
			this.progress_bar.css('height', obj.height);
			this.progress_bar.css('background-color', obj.barColor);
			this.progress_bar.css('top', obj.top);
			this.progress_bar.css('bottom', obj.bottom);
			this.addEvent(obj);
			this.updateProgress(obj);
		},

		updateProgress: function(event) {
			var scroll_top = $(window).scrollTop(); //current vertical position of the scroll bar
			var bottom_page = $(document).height() - $(window).height(); //(height of HTML document - height of browser viewport)
			var bar_xpos = scrollprogress.calculatePercent(scroll_top, bottom_page);
			scrollprogress.progress_bar.css({"transform": "translate3d("+bar_xpos+"%, 0px, 0px)"});

			//on progress event
			if(event.data) {
				var obj = event.data.obj;
				if(obj.onProgress) return obj.onProgress(bar_xpos + 100);
			}
		},

		calculatePercent: function(n1, n2) {
			var percent = Math.ceil(( n1 / n2 * 100 ) - 100);
			return percent;
		},

		addEvent: function(obj) {
			$(document).on('scroll', {obj: obj}, this.updateProgress);
			$(window).on('resize', {obj: obj}, this.updateProgress);
		}
	};

	gtris.ui.scrollprogress = scrollprogress;

})(window.gtris);
