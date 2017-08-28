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
			if(!_obj.isAllExpanded) _obj.isAllExpanded = false;
			this.addEvent(_obj);
		},

		collapseContent: function(event) {
			event.preventDefault();
			var _obj = event.data.obj;
			var $target = $(_obj.target);
			var $collapseHeader = $(event.target);
			var $collapseCnt = $target.find('.gt-collapse-content');
			var $thisCollapseCnt = $collapseHeader.closest('.gt-collapse-item').find('.gt-collapse-content');
			
			//show & hide
			if($thisCollapseCnt.is(':hidden')) {
				$thisCollapseCnt.slideDown(_obj.slideTime);
				$collapseHeader.closest('.gt-collapse-item').addClass('gt-active');
			}else{
				$thisCollapseCnt.slideUp(_obj.slideTime);
				$collapseHeader.parent().removeClass('gt-active');
			}

			var $collapseItem = $target.find('.gt-collapse-item');
			var $activeCollapseItem = $target.find('.gt-collapse-item.gt-active');

			_obj.isAllExpanded = false;
			//All Expanded
			if( $collapseItem.length === $activeCollapseItem.length ) {
				_obj.isAllExpanded = true;
				if(_obj.expanded) return _obj.expanded($target);
			}
			//One or more Collapsed
			if($activeCollapseItem.length === 0 || $activeCollapseItem.length < $collapseItem.length) {
				if(_obj.collapsed) return _obj.collapsed($target);
			}			
		},

		toggleCollapse: function(event) {
			event.preventDefault();
			var _obj = event.data.obj;
			var $target = $(_obj.target);
			var $allViewBtn = $(event.target);
			var thisCollapseItem = $allViewBtn.parents('.gt-collapse').find('.gt-collapse-item');
			var thisCollapseCnt = $allViewBtn.parents('.gt-collapse').find('.gt-collapse-content');
			
			//allViewBtn toggle class
			$allViewBtn.toggleClass('gt-dropdown-expanded');

			//show & hide
			if(_obj.isAllExpanded) {
				_obj.isAllExpanded = false;
				thisCollapseItem.removeClass('gt-active');
				thisCollapseCnt.slideUp(_obj.slideTime);
				if(_obj.collapsed) return _obj.collapsed($target);
			}else{
				_obj.isAllExpanded = true;
				thisCollapseItem.addClass('gt-active');
				thisCollapseCnt.slideDown(_obj.slideTime);
				if(_obj.expanded) return _obj.expanded($target);
			}
		},

		addEvent: function(obj) {
			$(obj.target).find('.gt-collapse-header').on('click', { obj: obj }, this.collapseContent);
			$(obj.target).find('[data-collapse="allview"]').on('click', { obj: obj }, this.toggleCollapse);
		}
	};

	gtris.ui.collapse = collapse;

})(window.gtris);
