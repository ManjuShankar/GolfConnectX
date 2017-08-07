$(function() {
    var fieldTypes = {
        shortText: '0',
        longText: '1',
        dropDown: '2',
        file: '3'
    };

    var fieldNames = {
        '0': 'Short Text',
        '1': 'Long Text',
        '2': 'Multiple Choice - Select One',
        '3': 'File'
    };

    function updateOptionsVisibility($el, fieldType) {
        var $options = $el.find('input[data-field=options]').closest('.form-group');

        $el.find('.field-type').text(fieldNames[fieldType]);

        if (fieldType == fieldTypes.dropDown) {
            $options.show();
        } else {
            $options.hide();
        }
    }

    function showForm($el) {
        $fieldList = $el.closest('.inline-field-list');
        $fieldList.find('.field-form').hide();

        $el.find('.field-form').show();

        var fieldType = $el.find('select[data-field=type]').val();
        updateOptionsVisibility($el, fieldType);
    }

    function setupFormHandler($el) {
        $el.find('.field-row').click(function() {
            showForm($el.find('.inline-form-field'));
        });

        $el.find('.field-drag').click(function(e) {
            e.stopPropagation();
        });

        $el.find('input[data-field=name]').on('keyup', function() {
            $el.find('.field-name').text($(this).val());
        });

        $el.find('select[data-field=type]').on('change', function() {
            var fieldType = $(this).val();
            updateOptionsVisibility($el, fieldType);
        });

        $el.find('.field-remove').click(function() {
            if (confirm('Are you sure you want to delete this field?')) {
                var input = $el.find('input.field-deleted');
                if (input.length) {
                    input.prop('checked', true);
                } else {
                    $el.remove();
                }

                $el.hide();
            }
        });
    }

    function updateOrder($el) {
        $el.find('.inline-field').each(function(idx, field) {
            var $field = $(field);

            $field.find('input[data-field=order]').val(idx);
        });
    }

    // Public API
    var CustomFormApi = {
        addField: function(el, elID) {
            var $el = $(el).closest('.inline-field');

            // Figure out new field ID by going over existing fields and finding maximum
            var id = elID;

            var $parentForm = $el.parent().closest('.inline-field');

            var $fieldList = $el.find('> .inline-field-list');

            var maxId = 0;

            $fieldList.children('.inline-field').each(function(idx, field) {
                var $field = $(field);

                var parts = $field.attr('id').split('-');
                idx = parseInt(parts[parts.length - 1], 10) + 1;

                if (idx > maxId) {
                    maxId = idx;
                }
            });

            var prefix = id + '-' + maxId;

            // Get template
            var $template = $($el.find('> .inline-field-template').text());
            $template.attr('id', prefix);

            // Fix form IDs
            $('[name]', $template).each(function(e) {
                var me = $(this);

                var id = me.attr('id');
                var name = me.attr('name');

                id = prefix + (id !== '' ? '-' + id : '');
                name = prefix + (name !== '' ? '-' + name : '');

                me.attr('id', id);
                me.attr('name', name);
            });

            $template.appendTo($fieldList);

            // Update defaults and setup handlers
            var $el =  $template.find('.inline-form-field');
            showForm($el);

            $el.find('.field-name').text('New field');
            $el.find('input[data-field=order]').val(maxId);

            setupFormHandler($template);

            faForm.applyGlobalStyles($template);
        }
    };

    // Default event logic
    $('.inline-field-list .inline-field').each(function(idx, el) {
        setupFormHandler($(el));
    });

    $('.inline-field-list').sortable({
        connectWith: '.inline-field-list',
        handle: '.field-drag',
        stop: function(event, ui) {
            updateOrder(ui.item.closest('.inline-field-list'));
        }
    });

    window.faCustomForm = CustomFormApi;
});