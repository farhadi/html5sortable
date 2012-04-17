/*
 * HTML5 Sortable jQuery Plugin
 * http://farhadi.ir/projects/html5sortable
 * 
 * Copyright 2012, Ali Farhadi
 * Released under the MIT license.
 */
(function($) {
var dragging, placeholders = $();
$.fn.sortable = function(options) {
	options = options || {};
	return this.each(function() {
		if (/^enable|disable|destroy$/.test(options)) {
			var items = $(this).children($(this).data('items')).attr('draggable', options == 'enable');
			if (options == 'destroy') {
				items.add(this).removeData('connectWith items')
					.off('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s');
			}
			return;
		}
		var index, items = $(this).children(options.items), connectWith = options.connectWith || false;
		var placeholder = $('<' + items[0].tagName + ' class="sortable-placeholder">');
		var handle = options.handle, isHandle;
		items.find(handle).mousedown(function() {
			isHandle = true;
		}).mouseup(function() {
			isHandle = false;
		});
		$(this).data('items', options.items)
		placeholders = placeholders.add(placeholder);
		if (connectWith) {
			$(connectWith).add(this).data('connectWith', connectWith);
		}
		items.attr('draggable', 'true').on('dragstart.h5s', function(e) {
			if (handle && !isHandle) {
				return false;
			}
			isHandle = false;
			var dt = e.originalEvent.dataTransfer;
			dt.effectAllowed = 'move';
			dt.setData('Text', 'dummy');
			dragging = $(this).addClass('sortable-dragging');
			index = dragging.index();
		}).on('dragend.h5s', function() {
			dragging.removeClass('sortable-dragging').fadeIn();
			placeholders.detach();
			if (index != dragging.index()) {
				items.parent().trigger('sortupdate');
			}
			dragging = null;
		}).not('a[href], img').on('selectstart.h5s', function() {
			this.dragDrop && this.dragDrop();
			return false;
		}).end().add([this, placeholder]).on('dragover.h5s dragenter.h5s drop.h5s', function(e) {
			if (!items.is(dragging) && connectWith !== $(dragging).parent().data('connectWith')) {
				return true;
			}
			if (e.type == 'drop') {
				e.stopPropagation();
				placeholders.filter(':visible').after(dragging);
				return false;
			}
			e.preventDefault();
			e.originalEvent.dataTransfer.dropEffect = 'move';
			if (items.is(this)) {
				dragging.hide();
				$(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
				placeholders.not(placeholder).detach();
			}
			return false;
		});
	});
};
})(jQuery);
