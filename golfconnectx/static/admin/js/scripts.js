(function() {
  $(function() {
    // Resizing
    function scaleMain() {
      var windowHeight = $(window).height();
      var topBarHeight = $('#topbar').height();

      var finalHeight = windowHeight - topBarHeight;

      $('.main-container').height(finalHeight);
    }

    scaleMain();

    $(window).resize(scaleMain);

    // Category handler
    $('#categoryMenuItems a').click(function() {
      var $btn = $(this);

      $('#categoryList').val($btn.data('id'));
      $btn.closest('form').submit();

      return false;
    });

    var Storage = function(name) {
      if (!name) {
        return null;
      }

      var isLSSupported = 'localStorage' in window && window['localStorage'] !== null;
      var isJSONSupported = 'JSON' in window && 'parse' in JSON && 'stringify' in JSON;
      var data = {};

      if (isLSSupported && isJSONSupported) {
        data = JSON.parse(localStorage.getItem(name)) || {};
      }

      var save = function() {
        if (isLSSupported && isJSONSupported) {
          localStorage.setItem(name, JSON.stringify(data));
        }
      }

      this.get = function(key) {
        return data[key];
      }

      this.set = function(key, value) {
        var oldVal = data[key];

        data[key] = value;
        save();

        return oldVal;
      }
    }

    // Instructions
    var instructionCollapsed = new Storage('instructions');
    $('.description-box .close').click(function(evt) {
        evt.preventDefault();
        var $parent = $(this).parent();
        var id = $parent.data('id');

        if (id) {
          instructionCollapsed.set(id, !$parent.hasClass('collapsed'))
        }

        $parent.toggleClass('collapsed');
    });

    $('.description-box').each(function(idx, el) {
      var $el = $(el);
      var id = $el.data('id');
      if (id && instructionCollapsed.get(id)) {
        $el.addClass('collapsed');
      }
    });
  });
})();
