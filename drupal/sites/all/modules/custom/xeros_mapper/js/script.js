
(function ($) {
    Drupal.behaviors.xerosMapper = {
        attach: function (context, settings) {
            var els = {};

            els.table = $('#dai-meter-collection-form table');
            els.rows = els.table.find('tr');
            els.expandButtons = els.rows.find('.expand');
            els.closeButtons = els.rows.find('.close');
            els.classificationCells = els.rows.find('.classification_id');

            els.detailsUrl = '/config/mapper/dai_meter_collection_detail/{{id}}',

            els.classificationUrl = '/config/mapper/classification/{{id}}',

            els.expandButtons.on('click', function() {
                var row = $(this).parents('tr');
                var id = $(row[0]).find('input[type=checkbox]').val();
                $.ajax({
                   url: els.detailsUrl.replace('{{id}}', id),
                   success: function(template) {
                       row.after('<tr class="details" data-id="' + id + '"><td></td><td colspan="8">' + template + '</td></tr>');
                   },
                   dataType: "html"
                });
                console.log(id);
            });

            els.closeButtons.on('click', function() {
                var row = $(this).parents('tr');
                var id = $(row[0]).find('input[type=checkbox]').val();
                $('.details[data-id="' + id + '"').remove();
            });

            els.classificationCells.on('click', function() {
                var row = $(this).parents('tr');
                var id = parseInt($(row[0]).find('.machine_id').html(), 10);
                $.ajax({
                    url: els.classificationUrl.replace('{{id}}', id), // TODO: Needs to be the Machine ID
                    success: function(template) {
                        row.after('<tr class="classifications" data-id="' + id + '"><td></td><td colspan="8">' + template + '</td></tr>');
                    },
                    dataType: "html"
                });
            })


            els.rows.each(function() {
                $(this).attr("data-id", $(this).find('input[type=checkbox]').val());
            });

        }
    }
} )(jQuery);