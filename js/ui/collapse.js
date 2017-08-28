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
			if(!_obj.expandable) _obj.expandable = false;
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
			
			//expandable
			if(!_obj.expandable) {
				$collapseCnt.parent().removeClass('gt-active');
				$collapseCnt.slideUp(_obj.slideTime);
			}

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
			if( $collapseItem.length === $activeCollapseItem.length ) {
				_obj.isAllExpanded = true;
				if(_obj.expanded) return _obj.expanded($target);
			}

			if($activeCollapseItem.length === 0) {
				if(_obj.collapsed) return _obj.collapsed($target);
			}
		},

		allExpand: function(event) {
			event.preventDefault();
			var _obj = event.data.obj;
			var $target = $(_obj.target);

			if(_obj.isAllExpanded) {
				_obj.isAllExpanded = false;
				$target.find('.gt-collapse-item').removeClass('gt-active');
				$target.find('.gt-collapse-content').slideUp(_obj.slideTime);
				if(_obj.collapsed) return _obj.collapsed($target);
			}else{
				_obj.isAllExpanded = true;
				$target.find('.gt-collapse-item').addClass('gt-active');
				$target.find('.gt-collapse-content').slideDown(_obj.slideTime);
				if(_obj.expanded) return _obj.expanded($target);
			}
		},

		addEvent: function(obj) {
			$(obj.target).find('.gt-collapse-header').on('click', { obj: obj }, this.collapseContent);
			$(obj.target).find('[data-collapse="all-expand"]').on('click', { obj: obj }, this.allExpand);
		}
	};

	gtris.ui.collapse = collapse;

})(window.gtris);
