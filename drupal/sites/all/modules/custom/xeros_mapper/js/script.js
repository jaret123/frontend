
(function ($) {
    Drupal.behaviors.xerosMapper = {
        attach: function (context, settings) {

            $(document).ready(function() {
                // Hide the classify button
                $('#edit-classify-submit').css('display', 'none');
            });
            jQuery('.classification_id').append('<div class="fa fa-caret-down classification__show"></div>');

            var els = {};

            els.rsUrl = 'http://' + window.location.host + '/xsvc/rs';

            els.rs = {
                // Create a new classification mapping
                'classify' : function(collection_id, classification_id) { return els.rsUrl + '/classify/' + collection_id + '/' + classification_id },
                // Unmap a record
                'unmatch' : function(collection_id) { return els.rsUrl + '/unmatch/' + collection_id },
                // Try to automatch a record
                'match' : function(collection_id) { return els.rsUrl + '/match/' + collection_id },
            };

            var showDetails = function() {
                var row = $(this).parents('tr');
                var id = $(row[0]).find('input[type=checkbox]').val();
                $.ajax({
                    url: els.detailsUrl.replace('{{id}}', id),
                    success: function(template) {
                        row.after('<tr class="details" data-id="' + id + '"><td colspan="9"><div class="details__close button">close</div>' + template + '</td></tr>');
                        position(id);
                        // Add a close button
                        $('.details__close').on('click', function(e) {
                            e.stopPropagation();
                            $('.details[data-id="' + id + '"]').remove();
                            position(id);
                            var expand = $(row).find('.expand');
                            $(expand).removeClass('inactive');
                            $(expand).on('click', showDetails);
                        });
                    },
                    dataType: "html"
                });
                $(this).unbind();
                $(this).addClass('inactive');
                console.log(id);
            }

            els.table = $('#dai-meter-collection-form table');
            els.rows = els.table.find('tr');
            els.expandButtons = els.rows.find('.expand');
            els.closeButtons = els.rows.find('.close');
            els.classificationCells = $('.classification__show');

            els.detailsUrl = '/config/mapper/dai_meter_collection_detail/{{id}}';

            els.classificationUrl = '/config/mapper/classification/{{id}}';

            /**
             * Show the details of a row
             */
            els.expandButtons.on('click', showDetails);

            var submitClassification = function(collectionId, classificationId) {
                console.log('Submit Classification', collectionId, classificationId);

                // TODO: At each stage, check for a 200 (success), for now use the complete method.

                // TODO: Console log the responses from the web service.
                $.ajax({
                   url: els.rs.classify(collectionId, classificationId),
                   dataType: 'text',
                   complete: function() {
                       // Check for ID - data back is text not JSON because of bug in web service
                       // classify web service has a bug where it returns a 500 response instead of a 200 even though
                       // classify is successful.
                       // Make this a complete method instead of success method for now.


                       $.ajax({
                           url: els.rs.unmatch(collectionId),
                           dataType: 'json',
                           complete: function() {
                               // Check for a return response of "true" - string not JSON
                               // This method will return a 200 if it does an unmatch.
                               $.ajax({
                                   url: els.rs.match(collectionId),
                                   dataType: 'json',
                                   complete: function() {
                                       // Check for a string return - id not JSON

                                   }
                               })
                           }
                       })
                   }

                });
            };


            var showClassification = function() {
                var row = $(this).parents('tr');
                var el = this;
                var id = parseInt($(row[0]).find('.machine_id').html(), 10);
                $.ajax({
                    url: els.classificationUrl.replace('{{id}}', id), // TODO: Needs to be the Machine ID
                    success: function(template) {
                        //row.after('<tr class="classifications" data-id="' + id + '"><td></td><td colspan="8">' + template + '</td></tr>');
                        $(el).after(
                            '<div class="classification-form" data-id="' + id + '">' +
                                template +
                                '<div class="classification__close button">Cancel</div>' +
                                '</div>'
                        );
                        $('#edit-classify-submit').clone().appendTo('.classification-form').css('display', 'inline-block').addClass('inactive');


                        $('#edit-classify-submit').on('click', function(e) {
                            if ( $(e.target).hasClass('inactive') ) {
                                e.preventDefault();
                            } else {
                                // Allow form to submit
                            }
                        });

                        $('.classification-form tr').on('click', function(e) {
                            e.stopPropagation;
                            $(this).siblings().removeClass('active');
                            $(this).addClass('active');

                            // Get the classification-form div and reference data from there
                            var form = $(this).closest('.classification-form');

                            // The collectionId is on the parent tr
                            var collectionId = form.closest('tr').data().id;

                            // The classificationId is on the descendant active row.
                            var classificationId = form.find('tr.active').data().classification_id;

                            // Place values in hidden field in form
                            $('#classify-collection_id').val(collectionId);
                            $('#classify-classification_id').val(classificationId);

                            // Remove the inactive class from the submit button
                            $('#edit-classify-submit').removeClass('inactive');

                        });

                        position(row.attr('data-id'));
                        // Add a close button
                        $('.classification__close').on('click', function(e) {
                            e.stopPropagation();
                            $('.classification-form[data-id="' + id + '"]').remove();
                        });

                    },
                    dataType: "html"
                });
            }

            /**
             * Show the reclassification window
             */
            els.classificationCells.on('click', showClassification);


            els.rows.each(function() {
                $(this).attr("data-id", $(this).find('input[type=checkbox]').val());
            });

            /**
             *
             * @param element -- the element to position
             * @param parent  -- the parent element
             * @param position -- the position (top, left, right, bottom)
             */
            var position = function(id) {
                var form = $('.classification-form');
                var details = $('.details[data-id="' + id +'"');

                if ( form.length > 0 ) {
                    if ( details.length > 0 ) {
                        $(form).css('top', details.height() + 26);
                    } else {
                        $(form).css('top', '26px');
                    }
                }
            }
        }
    }
} )(jQuery);