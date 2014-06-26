
(function ($) {
    Drupal.behaviors.xerosMapper = {
        attach: function (context, settings) {

            $(document).ready(function() {
                // Hide the classify button
                $('#edit-classify-submit').css('display', 'none');
            });
            jQuery('.classification_id')
                .append('<div class="text-button fa fa-plus-square classification__show"></div>&nbsp;')
                .append('<div class="text-button fa fa-minus-square classification__hide inactive"></div>')
                ;

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
                        row.after('<tr class="details" data-id="' + id + '"><td colspan="9">' + template + '</td></tr>');
                        position(id);
                        // Add a close button
//                        $('.details__close').on('click', function(e) {
//                            e.stopPropagation();
//                            $('.details[data-id="' + id + '"]').remove();
//                            position(id);
//                            var expand = $(row).find('.expand');
//                            $(expand).removeClass('inactive');
//                            $(expand).on('click', showDetails);
//                        });
                    },
                    dataType: "html"
                });
                //$(this).unbind();
                $(this).addClass('inactive')
                    .siblings()
                    .removeClass('inactive');
                console.log(id);
            }

            var hideDetails = function() {
                var row = $(this).parents('tr');
                var id = $(row[0]).find('input[type=checkbox]').val();
                event.stopPropagation();
                $('.details[data-id="' + id + '"]').remove();
                $(event.currentTarget)
                    .addClass('inactive')
                    .siblings()
                    .removeClass('inactive');
            }

            els.table = $('#dai-meter-collection-form table');
            els.rows = els.table.find('tr');
            els.expandButtons = els.rows.find('.sensors__show');
            els.closeButtons = els.rows.find('.sensors__hide');

            els.classificationShow = $('.classification__show');
            els.classificationHide = $('.classification__hide');

            els.detailsUrl = '/config/mapper/dai_meter_collection_detail/{{id}}';

            els.classificationUrl = '/config/mapper/classification/{{id}}';

            /**
             * Show the details of a row
             */
            els.expandButtons.on('click', showDetails);
            els.closeButtons.on('click', hideDetails);

            var showClassification = function() {
                console.log('showclassification');

                var row = $(this).parents('tr');
                var el = this;
                var id = parseInt($(row[0]).find('.machine_id').html(), 10);

                var classificationShow = $(row).find('.classification__show');

                var classificationHide = $(row).find('.classification__hide');

                // Any other oepn forms
                var classificationForm = $('.classification-form');

                classificationForm.remove();

                // Reset the status of all the arrows
                $('.classification__show').removeClass('inactive');
                $('.classification__hide').addClass('inactive');

                classificationShow.addClass('inactive');

                classificationHide.removeClass('inactive');

                // Get the classification form and show it.
                var url = els.classificationUrl.replace('{{id}}', id);


                console.log(url);
                $.ajax({
                    url: url, // TODO: Needs to be the Machine ID
                    success: function(template) {
                        //row.after('<tr class="classifications" data-id="' + id + '"><td></td><td colspan="8">' + template + '</td></tr>');
                        $(el).after(
                            '<div class="classification-form" data-id="' + id + '">' +
                                template +
                                '<div class="button classification__close">Cancel</div>' +
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
                            hideClassification();
                        });

                        // Add a close button
                        //$('.classification__close').on('click', hideClassification(id));
                    },
                    dataType: "html"
                });
            }

            var hideClassification = function() {
                console.log('Hide classfication');
                event.stopPropagation();

                var row = $(event.currentTarget).closest('tr');

                // Get the machine Id from the parent row.
                var machine_id = parseInt($(row).find('.machine_id').html(), 10);

                var classificationForm = $(row).find('.classification-form');

                var classificationShow = $(row).find('.classification__show');

                var classificationHide = $(row).find('.classification__hide');

                classificationForm.remove();

                classificationShow.removeClass('inactive');

                classificationHide.addClass('inactive');
            }

            /**
             * Show the reclassification window
             */
            els.classificationShow.on('click', showClassification);

            els.classificationHide.on('click', hideClassification);


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