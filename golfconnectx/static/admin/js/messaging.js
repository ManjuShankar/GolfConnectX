$(function() {
  var recipients = [];

  function removeRecipient() {
    var $li = $(this).parent();
    var id = $li.data('id');

    recipients = _.filter(recipients, function(v) {
      // Type-insensitive check
      return v != id;
    });
    $('#recipients').val(recipients.join('|'));

    $li.remove();

    return false;
  }

  $('#group_selector').change(function() {
    var data = $(this).find('option:selected').data();

    if ((data.id === -1) || (_.indexOf(recipients, data.id) != -1)) {
      return;
    }

    recipients.push(data.id);
    $(this).prop('selectedIndex', 0);
    $('#recipients').val(recipients.join('|'));


    $('<li />')
      .text(data.name)
      .data('id', data.id)
      .addClass('mtop-5')
      .append($('<button>')
                .addClass('close')
                .attr('aria-label', 'Close')
                .html('<span aria-hidden="true">x</span>')
                .click(removeRecipient)
              )
      .appendTo($('#recipient-list'));
  });

  $('#recipient-list button').click(removeRecipient);

  var val = $('#recipients').val();
  if (val && val.length) {
    recipients = val.split('|');
  }

  var receiver = [];

  $('#receiver-list button').click(removeRecipient);

  var val = $('#receiver').val();
  if (val && val.length) {
    receiver = val.split('|');
  }

  $('#user_selector').change(function() {
    var data = $(this).find('option:selected').data();

    if ((data.id === -1) || (_.indexOf(receiver, data.id) != -1)) {
      return;
    }

    receiver.push(data.id);
    $(this).prop('selectedIndex', 0);
    $('#receiver').val(receiver.join('|'));


    $('<li />')
      .text(data.name+' added as receiver')
      .data('id', data.id)
      .addClass('mtop-5')
      .append($('<button>')
                .addClass('close')
                .attr('aria-label', 'Close')
                .html('<span aria-hidden="true">x</span>')
                .click(removeRecipient)
              )
      .appendTo($('#receiver-list'));
  });

});