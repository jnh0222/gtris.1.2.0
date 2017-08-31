(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.ui) {
		gtris.ui = window.gtris.ui = {};
	}

	var dropdown = {

		init: function(obj) {
			this.addEvent(obj);
		},

		toggleDD: function(event) {
			event.stopPropagation();
			var $dd_button = $(event.target);
			$dd_button.parents('.gt-dropdown').toggleClass('gt-active');
		},

		documentClick: function(event) {
			var $dd_button = $(event.target);
			if( $dd_button.is('.gt-button') || $dd_button.is('.gt-btn') === false ) {
				var dropdownMenu = $('.gt-dd-menu');
				dropdownMenu.parents('.gt-dropdown').removeClass('gt-active');
			}
		},

		menuClick: function(event) {
			var _obj = event.data.obj;
			var $menu_item = $(event.target);
			if(_obj.changed) return _obj.changed($menu_item);
		},

		addEvent: function(obj) {
			var $dd = $(obj.target);
			$dd.find('button').on('click', this.toggleDD);
			$dd.find('.gt-dd-item').on('click', { obj: obj }, this.menuClick);
			$(document).on('click', this.documentClick);
		}
	};

	gtris.ui.dropdown = dropdown;

})(window.gtris);
