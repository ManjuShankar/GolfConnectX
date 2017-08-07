(function() {

  // Helpers
  function dataLoader(url) {
    return function(element, callback) {
      var id = $(element).val();

      if (id !== '') {
          $.ajax(url + '?id=' + id, {
            dataType: 'json'
          }).done(callback);
      }
    };
  }

  function makeButton(name) {
    var $btn = $('<a href="#" class="btn group-rule-button" />')
                 .on('click', function() {
                   $(this).closest('div.group-rule').remove();
                 })
                 .html(name + '&nbsp;&times;');

    var $btnDiv = $('<div class="col-md-4" />').append($btn);

    return $btnDiv;
  }

  function initSelect($node, text, searchUrl, lookupUrl, minInputLength) {
    if (typeof minInputLength == 'undefined') {
      minInputLength = 1;
    }

    $node.select2({
      placeholder: text,
      minimumInputLength: minInputLength,
      ajax: {
        url: searchUrl,
        dataType: 'json',
        quietMillis: 250,
        data: function (term, page) {
          return {
              q: term,
          };
        },
        results: function (data, page) {
          return {
            results: data
          };
        },
        cache: true
      },
      initSelection: dataLoader(lookupUrl)
    });
  }

  function createGenericRule(rule, value, text, searchUrl, lookupUrl, minInputLength) {
    var $container = $('#rule_container');

    // Button
    $btnDiv = makeButton(rule.name);

    // Selector
    var $node = $('<input type="text" class="form-control data-input" />');

    if (value) {
      $node.val(value['id']);
    }

    var $inputDiv = $('<div class="col-md-4" />').append($node);

    // Layout
    var $div = $('<div class="row group-rule clearfix" />')
                 .data({rule: rule.type})
                 .append($btnDiv)
                 .append($inputDiv)
                 .appendTo($container);

    // Setup select2
    initSelect($node, text, searchUrl, lookupUrl, minInputLength);
  }

  // Bubble handlers
  function createBubbleRule(rule, value) {
    createGenericRule(rule, value,
                      'Select Bubble',
                      '/admin/group_admin/ajax/bubble-search/',
                      '/admin/group_admin/ajax/bubble-lookup/');
  }

  function serializeBubbleRule($node) {
    return {
      type: 'bubble',
      'id': parseInt($node.find('input.data-input').val(), 10)
    };
  }

  // User handlers
  function createUserRule(rule, value) {
    createGenericRule(rule, value,
                      'Select User',
                      '/admin/group_admin/ajax/user-search/',
                      '/admin/group_admin/ajax/user-lookup/');
  }

  function serializeUserRule($node) {
    return {
      type: 'user',
      'id': parseInt($node.find('input.data-input').val(), 10)
    };
  }

  // Category handlers
  function createCategoryRule(rule, value) {
    createGenericRule(rule, value,
                      'Select Category',
                      '/admin/group_admin/ajax/category-search/',
                      '/admin/group_admin/ajax/category-lookup/',
                      null);
  }

  function serializeCategoryRule($node) {
    return {
      type: 'category',
      'id': parseInt($node.find('input.data-input').val(), 10)
    };
  }

  // Campus handlers
  function createCampusRule(rule, value) {
    createGenericRule(rule, value,
                      'Select Campus',
                      '/admin/group_admin/ajax/campus-search/',
                      '/admin/group_admin/ajax/campus-lookup/');
  }

  function serializeCampusRule($node) {
    return {
      type: 'campus',
      'id': parseInt($node.find('input.data-input').val(), 10)
    };
  }

  // Bio handlers
  function createBioRule(rule, value) {
    var $container = $('#rule_container');

    // Button
    $btnDiv = makeButton(rule.name);

    // Selector
    var $node = $('<input type="text" class="form-control data-input" />');

    if (value) {
      $node.val(value['id']);
    }

    var $inputDiv = $('<div class="col-md-4" />').append($node);

    // Value
    var $valInput = null;
    var $valDiv = $('<div class="col-md-4" />');

    function createValueInput(options) {
      // If it is same field type - skip
      if ($valInput) {
        if (options && $valInput.is('select')) {       
          return;
        } else if (!options && $valInput.is('input')) {
          return;
        }

        $valInput.select2('destroy');
        $valInput.remove();
      }

      if (!options) {
        $valInput = $('<input type="text" class="form-control value-input" />');
      } else {
        $valInput = $('<select class="form-control value-input" />');

        $.each(options, function(idx, value) {
            $valInput.append($('<option />', {value: value, text: value}));
        });
      }
      
      if (value) {
        $valInput.val(value['value']);
      }

      $valDiv.append($valInput);
    }

    // Layout
    var $div = $('<div class="row group-rule clearfix" />')
                 .data({rule: rule.type})
                 .append($btnDiv)
                 .append($inputDiv)
                 .append($valDiv)
                 .appendTo($container);

    // Setup select2
    $node.select2({
      placeholder: 'Select Profile Field',
      ajax: {
        url: '/admin/group_admin/ajax/bio-search/',
        dataType: 'json',
        quietMillis: 250,
        data: function (term, page) {
          return {
              q: term,
          };
        },
        results: function (data, page) {
          return {
            results: data
          };
        },
        cache: true
      },
      initSelection: function(element, callback) {
        var id = $(element).val();

        if (id !== '') {
          $.ajax('/admin/group_admin/ajax/bio-lookup/?id=' + id, {
            dataType: 'json'
          }).done(function(data) {
            createValueInput(data.options);
            callback(data);   
          });
        }
      }
    }).on('change', function(e) {
      var data = $(this).select2('data');

      createValueInput(data.options);  
    });
  }

  function serializeBioRule($node) {
    return {
      type: 'bio',
      'id': parseInt($node.find('input.data-input').val(), 10),
      'value': $node.find('.value-input').val()
    };
  }

  function initMemberRoleSelect(categoryId, node) {
    node.removeClass('select2-offscreen');
    initSelect(node,
               'Select Member Role',
               '/admin/group_admin/ajax/member-search/' + categoryId,
               '/admin/group_admin/ajax/member-lookup/',
               null);
  }

  function createMemberRoleRule(rule, value) {
    var $container = $('#rule_container');

    // Button
    $btnDiv = makeButton(rule.name);

    // Selector
    var $node = $('<input type="text" class="category-input form-control data-input" />');

    if (value) {
      $node.val(value['categoryId']);
    }

    var $inputDiv = $('<div class="col-md-4" />').append($node);

    // Value
    var $valInput = $('<input type="text" class="member-role-input form-control data-input" />');

    var $valDiv = $('<div class="col-md-4" />').append($valInput).hide();

    $node.change(function() {
      $valInput.val('');
      $valInput.select2({data: {}});
      $valDiv.show();
      initMemberRoleSelect($node.val(), $valInput);
    });

    // Layout
    var $div = $('<div class="row group-rule clearfix" />')
                 .data({rule: rule.type})
                 .append($btnDiv)
                 .append($inputDiv)
                 .append($valDiv)
                 .appendTo($container);

    // Setup select2
    initSelect($node,
               'Select Category',
               '/admin/group_admin/ajax/category-search/',
               '/admin/group_admin/ajax/category-lookup/',
               null);
    if (value) {
      $valDiv.show();
      $valInput.val(value['id']);
      initMemberRoleSelect(value['categoryId'], $valInput)
    }
  }

  function serializeMemberRoleRule($node) {
    return {
      type: 'memberRole',
      'id': parseInt($node.find('input.data-input.member-role-input').val(), 10),
      'categoryId': parseInt($node.find('input.data-input.category-input').val(), 10)
    };
  }

  function initFormFieldSelect(categoryId, node) {
    node.removeClass('select2-offscreen');
    initSelect(node,
               'Select Form Field',
               '/admin/group_admin/ajax/form-field-search/' + categoryId,
               '/admin/group_admin/ajax/form-field-lookup/',
               null);
  }


  function createFormFieldRule(rule, value) {
    var $container = $('#rule_container');

    // Button
    $btnDiv = makeButton(rule.name);

    // Category
    var $node = $('<input type="text" class="category-input form-control data-input" />');

    if (value) {
      $node.val(value['categoryId']);
    }

    var $inputDiv = $('<div class="col-md-4" />').append($node);

    // Form
    var $formInput = $('<input type="text" class="form-input form-control data-input" />');

    var $formDiv = $('<div class="col-md-4" />').append($formInput).hide();

    $node.change(function() {
      $formInput.val('');
      $formInput.select2({data: {}});
      $formDiv.show();
      initFormFieldSelect($node.val(), $formInput);
    });

    // Value
    var $valInput = $('<input type="text" class="form-control value-input" />');

    var $valDiv = $('<div class="col-md-2" />').append($valInput).hide();
    $formInput.change(function(){
      $valDiv.show();
    });
    // Layout
    var $div = $('<div class="row group-rule clearfix" />')
                 .data({rule: rule.type})
                 .append($btnDiv)
                 .append($inputDiv)
                 .append($formDiv)
                 .append($valDiv)
                 .appendTo($container);

    // Setup select2
    initSelect($node,
               'Select Category',
               '/admin/group_admin/ajax/category-search/',
               '/admin/group_admin/ajax/category-lookup/',
               null);
    if (value) {
      $formDiv.show();
      $formInput.val(value['id']);
      initFormFieldSelect(value['categoryId'], $formInput);
      $valDiv.show();
      $valInput.val(value['value']);
    }

  }

  function serializeFormFieldRule($node) {
    return {
      type: 'formField',
      'categoryId': parseInt($node.find('input.category-input').val(), 10),
      'id': parseInt($node.find('input.form-input').val(), 10),
      'value': $node.find('input.value-input').val()
    };
  }

  // All users
  function createAllRule(rule, value) {
    var $container = $('#rule_container');

    // Button
    $btnDiv = makeButton(rule.name);

    // Layout
    var $div = $('<div class="row group-rule clearfix" />')
                 .data({rule: rule.type})
                 .append($btnDiv)
                 .appendTo($container);
  }

  function serializeAllRule($node) {
    return {
      type: 'all'
    };
  }

  // User role handlers
  function createUserRoleRule(rule, value) {
    createGenericRule(rule, value,
                      'Select User Role',
                      '/admin/group_admin/ajax/user-role-search/',
                      '/admin/group_admin/ajax/user-role-lookup/',
                      null);
  }

  function serializeUserRoleRule($node) {
    return {
      type: 'userRole',
      'id': parseInt($node.find('input.data-input').val(), 10)
    };
  }

  // Enrollment user role
  function createEnrollmentRule(rule, value) {
    var $container = $('#rule_container');

    // Button
    // TODO: Fix me - can't use rule name because it is way too long to fit
    $btnDiv = makeButton('Enrollment Status');

    // Selector
    var $node = $('<select class="form-control data-input" />');
    $node.append($('<option value="2">Not Enrolled</option>'));
    $node.append($('<option value="3">Enrolled</option>'));
    $node.append($('<option value="1">Undecided</option>'));

    if (value) {
       $node.val(value['status']);
     }

    var $inputDiv = $('<div class="col-md-4" />').append($node);

    // Layout
    var $div = $('<div class="row group-rule clearfix" />')
          .data({rule: rule.type})
          .append($btnDiv)
          .append($inputDiv)
          .appendTo($container);

    // Setup select2
    $node.select2();
  }

  function serializeEnrollmentRule($node) {
    return {
      type: 'enrollmentStatus',
      status: $node.find('select').val()
    };
  }

  // Enrollment score role
  function createEnrollmentScoreRule(rule, value) {
    var $container = $('#rule_container');

    // Button
    // TODO: Fix me - can't use rule name because it is way too long to fit
    if (isAdmissionDeployment) {$btnDiv = makeButton('Enrollment Score');}
    else {$btnDiv = makeButton('Engagement Score');}

    // Selector 1
    var $node1 = $('<select style="font-weight: 600;" class="form-control data-input"/>');
    $node1.append($('<option value="-1" hidden>Select Lowest Score</option>'));
    for (i = 0; i <= 10; i++) {
    $node1.append($('<option value="' + i + '">' + i + '</option>'));
    };

    if (value) {
      $node1.val(value['lower']);
    }
    else{$node1.val("-1")};


    // Selector 2
    var $node2 = $('<select style="margin-top: 10px;font-weight: 600;" id="node2" class="form-control data-input"/>');
    $node2.append($('<option value="11" hidden>Select Highest Score</option>'));
    for (i = 0; i <= 10; i++) {
    $node2.append($('<option value="' + i + '">' + i + '</option>'));
    };

    if (value) {
      $node2.val(value['higher']);
    }
    else{$node2.val("11")};

    var $inputDiv = $('<div class="col-md-4" />').append($node1).append($node2);

    // Layout
    var $div = $('<div class="row group-rule clearfix" />')
          .data({rule: rule.type})
          .append($btnDiv)
          .append($inputDiv)
          .appendTo($container);

    // Setup select2
    $inputDiv.select2();
  }

  function serializeEnrollmentScoreRule($node) {
    return {
      type: 'enrollmentScore',
      lower: $node.find('select').val(),
      higher: $( "#node2" ).val()

    };
  }

  // Internal
  var ruleTypes = {
    'user': {
      name: 'User',
      type: 'user',
      handler: createUserRule,
      serialize: serializeUserRule
    },
    'bubble': {
      name: 'Bubble',
      type: 'bubble',
      handler: createBubbleRule,
      serialize: serializeBubbleRule
    },
    'category': {
      name: 'Category',
      type: 'category',
      handler: createCategoryRule,
      serialize: serializeCategoryRule
    },
    'campus': {
      name: 'Campus',
      type: 'campus',
      handler: createCampusRule,
      serialize: serializeCampusRule
    },
    'bio': {
      name: 'Bio Field',
      type: 'bio',
      handler: createBioRule,
      serialize: serializeBioRule
    },
    'memberRole': {
      name: 'Member Role',
      type: 'memberRole',
      handler: createMemberRoleRule,
      serialize: serializeMemberRoleRule
    },
    'formField': {
      name: 'Form Field',
      type: 'formField',
      handler: createFormFieldRule,
      serialize: serializeFormFieldRule
    },
    'userRole': {
      name: 'User Role',
      type: 'userRole',
      handler: createUserRoleRule,
      serialize: serializeUserRoleRule
    },
    'all': {
      name: 'All Users',
      type: 'all',
      handler: createAllRule,
      serialize: serializeAllRule
    },
    'enrollmentStatus': {
      name: 'Enrollment Status',
      type: 'enrollmentStatus',
      handler: createEnrollmentRule,
      serialize: serializeEnrollmentRule
    },
    'enrollmentScore': {
      name: isAdmissionDeployment && 'Enrollment Score' || 'Engagement Score',
      type: 'enrollmentScore',
      handler: createEnrollmentScoreRule,
      serialize: serializeEnrollmentScoreRule
    }
  };

  function addRule() {
    var ruleType = $('#rule_types').val();
    var rule = ruleTypes[ruleType];
    rule.handler(rule);
  }

  function initRules(rules) {
    $('#operator').val(rules.operator);

    $.each(rules.rules, function(idx, rule) {
      var r = ruleTypes[rule.type];
      if (r) {
        r.handler(r, rule);
      }
    });
  }

  function serializeRules() {
    var $container = $('#rule_container');

    var results = [];

    $.each($container.children('div.group-rule'), function(idx, rule) {
      var $rule = $(rule);

      var ruleType = $rule.data('rule');
      var handler = ruleTypes[ruleType];
      if (handler) {
        results.push(handler.serialize($rule));
      }
    });

    var ruleSet = {
      operator: $('#operator').val(),
      rules: results
    };

    $('#rules').val(JSON.stringify(ruleSet));
  }

  function init() {
    $(function() {
      var $ruleTypes = $('#rule_types');

      $.each(ruleTypes, function(name, rule) {
        if(isAdmissionDeployment && (rule.type == 'memberRole' || rule.type == 'formField')){
        return true;
        }
        $ruleTypes.append(
          $('<option />').attr('value', name).text(rule.name)
        );
      });

      $('#add_rule').click(addRule);

      $('.form-horizontal').submit(function(e) {
        serializeRules();
      });

      // Load existing rules
      var rulesJson = $('#rules').val();
      if (rulesJson) {
        var rules = JSON.parse(rulesJson);
        initRules(rules);
      }
    });
  }

  window.userGroup = {
    init: function(config) {
      init(config);
    }
  };
})();
