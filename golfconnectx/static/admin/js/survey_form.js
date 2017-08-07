$(function() {
    // TODO: Clean me up - lots of shared code with custom_form.js and Flask-Admin form handling code
    var fieldTypes = {
        shortText: '0',
        selectOne: '1',
        selectMany: '2',
    };

    var fieldNames = {
        '0': 'Short Text',
        '1': 'Select One',
        '2': 'Select Many',
    };

    function updateOptionsVisibility($el, fieldType) {
        var $options = $el.find('.answer-form').closest('.form-group');

        $el.find('.field-type').text(fieldNames[fieldType]);

        if (fieldType != fieldTypes.shortText) {
            $options.show();
        } else {
            $options.hide();
        }
    }

    function showForm($el) {
        $fieldList = $el.closest('.inline-field-list');
        $fieldList.find('.field-form').hide();

        $el.find('> .field-form').show();

        var fieldType = $el.find('select[data-field=type]').val();
        updateOptionsVisibility($el, fieldType);
    }

    function setupFormHandler($el, deleteMessage) {
        $el.find('.inline-form-field .field-row').click(function() {
            showForm($el.find('> .inline-form-field'));
        });

        $el.find('.inline-form-field .field-drag').click(function(e) {
            e.stopPropagation();
        });

        $el.find('> .inline-form-field > .field-row > .field-remove').click(function() {
            if (confirm(deleteMessage)) {
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

    function setupQuestionFormHandler($el) {
        setupFormHandler($el, 'Are you sure you want to delete this field?');

        $el.find('[data-field=name]').on('keyup', function() {
            var $name = $el.find('> .inline-form-field > .field-row > .field-name');
            $name.text($(this).val());
        });

        $el.find('select[data-field=type]').on('change', function() {
            var fieldType = $(this).val();
            updateOptionsVisibility($el, fieldType);
        });
    }

    function setupAnswerFormHandler($el) {
        setupFormHandler($el, 'Are you sure you want to delete this option?');

        $el.find('select[data-field=type]').on('change', function() {
            var fieldType = $(this).val();
            updateOptionsVisibility($el, fieldType);
        });

        // Image handling
        var $upload = $el.find('input[type=file]');
        var $img = $el.find('img[data-field=upload-img]');
        var $field = $el.find('input[data-field=image-id]');
        var $removeImage = $el.find('.remove-image');

        $upload.fileupload({
            dataType: 'json',
            formData: [],
            progress: function(e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $el.find('.upload-progress').removeClass('hidden').text(progress);
            },
            done: function(e, data) {
                $el.find('.upload-progress').addClass('hidden');

                $field.val(data.result.id);
                $img.attr('src', data.result.url);
                $removeImage.removeClass('hidden');
            }
        });

        $img.click(function() {
            $upload.click();
        });

        $removeImage.click(function() {
            // TODO: Delete file on the server?
            $field.val('');
            $img.attr('src', $img.data('default'));

            $removeImage.addClass('hidden');
        });
    }

    function updateOrder($el) {
        $el.children('.inline-field').each(function(idx, field) {
            var $field = $(field);

            $field.find('input[data-field=order]').val(idx);
        });
    }

    function addField(el, elID) {
        var $el = $(el).closest('.inline-field');

        // Figure out new field ID by going over existing fields and finding maximum
        var id = elID;

        var $parentForm = $el.parent().closest('.inline-field');

        var $fieldList = $el.find('> .inline-field-list');

        var maxId = 0;
        var maxOrder = 0;

        $fieldList.children('.inline-field').each(function(idx, field) {
            var $field = $(field);

            var parts = $field.attr('id').split('-');
            idx = parseInt(parts[parts.length - 1], 10) + 1;

            if (idx > maxId) {
                maxId = idx;
            }

            var $order = $field.find('> .inline-form-field > .field-form > input[data-field=order]');
            var order = parseInt($order.val(), 10) + 1;

            if (order > maxOrder) {
                maxOrder = order;
            }
        });

        var prefix = id + '-' + maxId;

        if ($parentForm.hasClass('fresh')) {
            prefix = $parentForm.attr('id') + '-' + prefix;
        }

        // Get template
        var $template = $($el.find('> .inline-field-template').text());
        $template.attr('id', prefix);

        // Fix form IDs
        $('[name]', $template).each(function(e) {
            var me = $(this);

            if (me.attr('type') == 'file') {
                return;
            }

            var id = me.attr('id');
            var name = me.attr('name');

            id = prefix + (id !== '' ? '-' + id : '');
            name = prefix + (name !== '' ? '-' + name : '');

            me.attr('id', id);
            me.attr('name', name);
        });

        $template.addClass('fresh');

        $template.appendTo($fieldList);

        $template.find('> .inline-form-field > .field-form > input[data-field=order]').val(maxOrder);

        // Update defaults and setup handlers
        var $el =  $template.find('.inline-form-field');
        showForm($el);

        return $template;
    }

    // Public API
    var SurveyFormApi = {
        addField: function(el, elID) {
            // Insert template
            var $template = addField(el, elID);

            setupQuestionFormHandler($template);

            $template.find('.field-name').text('New field');

            faForm.applyGlobalStyles($template);
        },

        addOption: function(el, elID) {
            // Insert template
            var $template = addField(el, elID);

            setupAnswerFormHandler($template);

            faForm.applyGlobalStyles($template);        }
    };

    // Default event logic
    $('.question-form > .inline-field-list > .inline-field').each(function(idx, el) {
        setupQuestionFormHandler($(el));
    });

    $('.answer-form > .inline-field-list > .inline-field').each(function(idx, el) {
        setupAnswerFormHandler($(el));
    });

    $('.inline-field-list').sortable({
        connectWith: '.inline-field-list',
        handle: '.field-drag',
        stop: function(event, ui) {
            updateOrder(ui.item.closest('.inline-field-list'));
        }
    });

    window.faSurveyForm = SurveyFormApi;
});