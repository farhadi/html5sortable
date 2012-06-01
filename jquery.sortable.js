/*
 * HTML5 Sortable jQuery/Zepto Plugin
 * http://farhadi.ir/projects/html5sortable
 * 
 * Copyright 2012, Ali Farhadi
 * Released under the MIT license.
 */
(function ($) {
    var dragging, placeholder;
    $.extend($.fn, {
        sortable: function (options) {
            options = $.extend({
                connectWith: false
            }, options);
            return this.each(function () {
                var isHandle, index;
                var items = $(this).children(options.items).attr('draggable', 'true');
                placeholder = $('<' + items[0].tagName + ' class="sortable-placeholder">');
                items.find(options.handle).mousedown(function () {
                    isHandle = true;
                }).mouseup(function () {
                    isHandle = false;
                });
                $(this).data('connectWith', options.connectWith);
                items.on('dragstart', function (e) {
                    if (options.handle && !isHandle) return false;
                    isHandle = false;
                    index = (dragging = $(this)).index();
                    var dt = e.originalEvent ? e.originalEvent.dataTransfer : e.dataTransfer;
                    dt.effectAllowed = 'move';
                    dt.setData('text', 'ff');
                }).on('dragend', function (e) {
                    dragging.show();
                    if (index != dragging.index()) {
                        items.parent().trigger('sortupdate', { item: dragging });
                    }
                    placeholder.remove();
                    dragging = null;
                }).not('a[href], img').on('selectstart', function () {
                    this.dragDrop && this.dragDrop();
                    return false;
                }).add(this).on('dragover dragenter drop', function (e) {
                    if (items.index(dragging) === -1 && (options.connectWith !== $(dragging).parent().data('connectWith') || !options.connectWith)) {
                        return true;
                    }
                    if (e.type === 'dragenter') {
                        if (items.index(this) != -1) {
                            dragging.hide();
                            $(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
                        }
                    }
                    if (e.type == 'drop') {
                        e.stopPropagation();
                        placeholder.after(dragging);
                    }
                    return false;
                });
            });
        }
    });
})(this.jQuery || this.Zepto);
