/*
 * HTML5 Sortable jQuery Plugin
 * http://farhadi.github.com/html5sortable
 * 
 * Copyright 2012, Ali Farhadi
 * Released under the MIT license.
 */
jQuery.fn.sortable = function() {
	return this.each(function() {
		var $ = jQuery, dragging, dropHandler, dragHandler, items = $(this).children();
		var dropHandler = function(e) {
			if (!dragging) return true;
			e.stopPropagation();
			placeholder.after(dragging);
			return false;
		}; 
		var dragHandler = function(e) {
			if (!dragging) return true;
			e.preventDefault();
			e.originalEvent.dataTransfer.dropEffect = 'move';
			if (items.is(this)) {
				dragging.hide();
				$(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
			}
			return false;
		};
		var placeholder = $('<' + items[0].tagName + '>').addClass('sortable-placeholder')
			.bind('dragover', dragHandler).bind('drop', dropHandler);

		items.attr('draggable', 'true').bind('dragstart', function(e) {
			var dt = e.originalEvent.dataTransfer;
			dt.effectAllowed = 'move';
			dt.setData('Text', 'dummy');
			dragging = $(this).addClass('sortable-dragging');
		}).bind('dragend', function() {
			dragging.removeClass('sortable-dragging').fadeIn();
			placeholder.detach();
			dragging = null;
		}).not('a[href], img').bind('selectstart', function() {
			this.dragDrop && this.dragDrop();
			return false;
		}).end().add(this).bind('dragover dragenter', dragHandler).bind('drop', dropHandler);
	});
};
