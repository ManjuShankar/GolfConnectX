$(function() {
  var url = '/api/v2/admin/analytic/';

  function pullData(period) {
    $.ajax({
      url: url + period,
      success: function(data) {
        $.plot('#graph', [data], {
          lines: {
        		show: true,
        		fill: true
        	},
        	xaxis: {
            mode: 'time',
            timeformat: "%d %b"
          },
      grid: {
        borderWidth: {top: 1, right: 0, bottom: 0, left: 1},
        borderColor: {top: "#FFF", left: "#FFF"}
      }
        });
      }
    });
  }

  $('#graph_period a').click(function(e) {
  	e.preventDefault();

  	var $this = $(this);

  	$('#graph_period_current').text($this.text());

  	pullData($this.data('period'));
  });

  pullData('month');
});
