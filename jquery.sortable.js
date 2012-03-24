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
	return this.each(function() {
		var index, items = $(this).children(), connectWith = false;
		var placeholder = $('<' + items[0].tagName + '>').addClass('sortable-placeholder');
		placeholders = placeholders.add(placeholder);
		if (options && options.connectWith) {
			$(connectWith = options.connectWith).add(this).data('connectWith', connectWith);
		}
		items.attr('draggable', 'true').bind('dragstart', function(e) {
			var dt = e.originalEvent.dataTransfer;
			dt.effectAllowed = 'move';
			dt.setData('Text', 'dummy');
			dragging = $(this).addClass('sortable-dragging');
			index = dragging.index();
		}).bind('dragend', function() {
			dragging.removeClass('sortable-dragging').fadeIn();
			placeholders.detach();
			if (index != dragging.index()) {
				items.parent().trigger('sortupdate');
			}
			dragging = null;
		}).not('a[href], img').bind('selectstart', function() {
			this.dragDrop && this.dragDrop();
			return false;
		}).end().add([this, placeholder]).bind('dragover dragenter', function(e) {
			if (!items.is(dragging) && connectWith !== $(dragging).parent().data('connectWith')) {
				return true;
			}
			e.preventDefault();
			e.originalEvent.dataTransfer.dropEffect = 'move';
			if (items.is(this)) {
				dragging.hide();
				$(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
				placeholders.not(placeholder).detach();
			}
			return false;
		}).bind('drop', function(e) {
			if (!items.is(dragging) && connectWith !== $(dragging).parent().data('connectWith')) {
				return true;
			}
			e.stopPropagation();
			placeholder.after(dragging);
			return false;
		});
	});
};
})(jQuery);
