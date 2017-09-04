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
			if(gtris.util.browser.name === 'ie' && gtris.util.browser.version <= 9) {
				return;
			}else{
				this.progress_bar = $(obj.target);
				this.progress_bar.attr({ max: this.getMax() });
				this.addEvent(this.progress_bar);
				this.windowResize();
			}
		},

		documentScroll: function(event) {
			scrollprogress.progress_bar.attr({ value: scrollprogress.getValue() });
		},

		windowResize: function(event) {
			scrollprogress.progress_bar.attr({ max: scrollprogress.getMax(), value: scrollprogress.getValue() });
		},

		getMax: function() {
			return $(document).height() - $(window).height();
		},

		getValue: function() {
			return $(window).scrollTop();
		},

		addEvent: function(progress_bar) {
			$(document).on('scroll', this.documentScroll);
			$(window).on('resize', this.windowResize);
		}

	};

	gtris.ui.scrollprogress = scrollprogress;

})(window.gtris);
