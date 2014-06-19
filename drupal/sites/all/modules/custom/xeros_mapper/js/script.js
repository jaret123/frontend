
(function ($) {
    Drupal.behaviors.xerosMapper = {
        attach: function (context, settings) {

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

                $.ajax({
                   url: els.rs.classify(collectionId, classificationId),
                   dataType: 'json',
                   success: function() {
                       $.ajax({
                           url: els.rs.unmatch(collectionId),
                           dataType: 'json',
                           success: function() {
                               $.ajax({
                                   url: els.rs.match(collectionId),
                                   dataType: 'json',
                                   success: function() {
                                       console.log('Success - TODO: Redraw the table row.');
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
                            '<div class="classification-form" data-id="' + id +  '">' + template + '<div class="classification__close button">Cancel</div><div class="classification__submit button inactive">Save</div></div>'
                        );
//                        $('.classification-form').on('click', function(e) {
//                            e.stopPropagation;
//                        });



                        $('.classification-form tr').on('click', function(e) {
                            e.stopPropagation;
                            $(this).siblings().removeClass('active');
                            $(this).addClass('active');
                            $('.classification__submit').removeClass('inactive');

                        });

//                        $('.classification-form').on('dragstart', handleDragStart);
//                        $('.classification-form').on('dragend', handleDragEnd);

                        $('.classification__submit').on('click', function() {
                            // TODO - check to see if I am active
                            if ( $(this).hasClass('.inactive' )) {
                                // Do nothing
                            } else {
                                var form = $(this).parent();
                                var data = form.find('tr.active').data();

                                // TODO - get the active classification id from the table
                                var classificationId = data.classification_id;
                                // TODO - get the collection id from the row
                                var collectionId = form.parent().parent().data().id;

                                submitClassification(collectionId, classificationId);

                                // TODO - Close this window and put something in the Drupal Set Message (can we do that with JS)
                            }

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

//            var handleDragStart = function(e) {
//                var offset = $(this).offset();
//                var relativeX = (e.originalEvent.x - offset.left);
//                var relativeY = (e.originalEvent.y - offset.top);
//
//                console.log("Start - X: " + relativeX + "  Y: " + relativeY);
//            }
//            var handleDragEnd = function(e) {
//                var offset = $(this).offset();
//                var relativeX = (e.originalEvent.x - offset.left);
//                var relativeY = (e.originalEvent.y - offset.top);
//
//                console.log("End - X: " + relativeX + "  Y: " + relativeY);
//            }



        }
    }
} )(jQuery);