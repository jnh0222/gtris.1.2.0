(function(gtris) {
	'use strict';
	if (!gtris) {
		gtris = window.gtris = {};
	}
	if (!gtris.ui) {
		gtris.ui = window.gtris.ui = {};
	}

	var collapse = {

		init: function(obj) {
			var _obj = obj;
			if(!_obj.slideTime) _obj.slideTime = 250;
			if(!_obj.isAllExpand) _obj.isAllExpand = false;
			this.addEvent(_obj);
		},

		collapseHeaderClick: function(event) {
			event.preventDefault();
			var obj = event.data.obj;
			var $accordion = $(obj.target);
			var $this_header = $(event.target);
			var $this_content = $this_header.closest('.gt-collapse-item').find('.gt-collapse-content');
			var $acd_content = $accordion.find('.gt-collapse-content');
			obj.isAllExpand = false;

			//show & hide
			if($this_content.is(':hidden')) {
				$this_content.slideDown(obj.slideTime);
				$this_header.closest('.gt-collapse-item').addClass('gt-active');
			}else{
				$this_content.slideUp(obj.slideTime);
				$this_header.parent().removeClass('gt-active');
			}

			//check all expand
			if( $accordion.find('.gt-collapse-item').length === $accordion.find('.gt-collapse-item.gt-active').length ) {
				obj.isAllExpand = true;
				if(obj.expanded) return obj.expanded($accordion);
			}

			//check all collapse
			if($accordion.find('.gt-collapse-item.gt-active').length === 0) {
				if(obj.expanded) return obj.collapsed($accordion);	
			}
		},

		toggleExpand: function(event) {
			event.preventDefault();
			var obj = event.data.obj;
			var $accordion = $(obj.target);
			var $acd_content = $accordion.find('.gt-collapse-content');
			var $acd_item = $accordion.find('.gt-collapse-item');

			//toggle all contents
			if(!obj.isAllExpand) {
				obj.isAllExpand = true;
				$acd_content.slideDown(obj.slideTime);
				$acd_item.addClass('gt-active');
				if(obj.collapsed) return obj.expanded($accordion);
			}else{
				obj.isAllExpand = false;
				$acd_content.slideUp(obj.slideTime);
				$acd_item.removeClass('gt-active');
				if(obj.collapsed) return obj.collapsed($accordion);
			}
		},

		addEvent: function(obj) {
			$(obj.target).find('.gt-collapse-header').on('click', { obj: obj }, this.collapseHeaderClick);
			$(obj.target).find('[data-toggle="expand"]').on('click', { obj: obj }, this.toggleExpand);
		}
	};

	gtris.ui.collapse = collapse;

})(window.gtris);
