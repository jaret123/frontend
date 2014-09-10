/**
 * Namespace: FF
 *   Setup namespace if it has not already been setup.
 */
var FF = FF || {};

/**
 * Class: FF.Hud
 *   Encapsulates functionality related to the header
 */
FF.Hud = (function($){

    /**
     * Variable: els
     *   A cache for element references
     * @type {{}}
     */
    var els = {};

    /**
     * Variable: pub
     *   Contains publicly accessible methods
     * @type {{}}
     */
    var pub = {};


    var data = {};

    var tpl = {};

    var services = {};

    var status = {};

    var history = {};

    var machineHistory = {};

    var machineIds = [];

    // Turn refresh on
    var refresh = true;

    var refreshInterval = 5 * 60; // 5 minutes


    formatData = function() {
        // Grab the global data object and create a local copy so we can
        // refactor easily later;

        data.machine = {
            'companies' : {}
        };

        //var j = 0;
        var alert = 0;

//        for (i = 0; i < xerosMachines.length; i++) {
//            var m = xerosMachines[i];
//
//            data.machineSource[m.machine_id] = m;
//
//            machineIds.push(parseInt(m.machine_id));
//        }

        // Temp
        //machineIds = [6,7];

        //for (i = 0; i < data.machineSource.length; i++) {
        for (var i in data.machineSource) {
            if (data.machineSource.hasOwnProperty(i)) {

                //console.log(data.machineSource[i]);
                var m = data.machineSource[i];

                // If the company is not on the object yet, initialize it
                if ( typeof data.machine.companies[m.company_title] == 'undefined') {
                    data.machine.companies[m.company_title] = {
                        'locations' : {},
                        'company_title' : m.company_title
                    };
                }
                // If the location is not on the object yet, initialize it
                if ( typeof data.machine.companies[m.company_title].locations[m.location_title] == 'undefined') {
                    data.machine.companies[m.company_title].locations[m.location_title] = {
                        'machines' : {},
                        'location_title' : m.location_title,
                    };
                }

                // Set the model filter
                if (m.manufacturer == 'Xeros' ) {
                    m.modelFilter = 'xeros';
                } else {
                    m.modelFilter = 'non-xeros';
                }

                data.machine.companies[m.company_title].locations[m.location_title].machines[i] = m;
            }
        }
        console.log (data.machine);
    };

    formatStatus = function(data) {
        var _status = {};
        for (i=0; i < data.length; i++) {
            var _machineStatus = data[i];
            if ( _machineStatus !== null ) {
                var _machineId = _machineStatus.machineId;
                delete _machineStatus.machineId;
                _status[_machineId] = _machineStatus;
            }
        };
        return _status;
    };

    formatHistory = function(data) {
        var _status = {};
        for (i=0; i < data.length; i++) {
            var _machineStatus = data[i];
            var _machineId = _machineStatus.machineId;
            var _statusId = _machineStatus.id;

            delete _machineStatus.machineId;
            delete _machineStatus.id;

            if ( typeof _status[_machineId] === 'undefined' ) {
                _status[_machineId] = {} ;
            } else {
                _status[_machineId][_statusId] = _machineStatus;
            }

        };
        return _status;
    };

    loadStatus = function(callback) {
        jQuery.ajax({
            url: 'status-board-request/status/' + machineIds.toString(),
            //data: '[' + machineIds.toString() + ']',
            success: function(d) {
                status = formatStatus(d);
            },
            dataType: 'json',
            type: 'GET',
            contentType: 'application/json'
        });
    };

    loadHistory = function(machineId, callback) {
        jQuery.ajax({
            url: 'status-board-request/history/' + machineId.toString(),
            //data: '[' + machineId.toString() + ']',
            success: function(d) {
                history = formatHistory(d);
                callback(d, machineId);
            },
            dataType: 'json',
            type: 'GET',
            contentType: 'application/json'
        });
    };

    loadData = function(callback) {
        jQuery.ajax({
           url: 'status-board-request/machines/NULL',
            success: function(d) {
                data.machineSource = d;
                callback();
            },
            dataType: 'json',
            type: 'GET',
            contentType: 'application/json'
        });
    };


    loadMachineTemplate = function(callback) {
        $.ajax({
            //url: Drupal.settings.xeros_ops.modulePath + '/tpl/machine.tpl.html',
            url: Drupal.settings.xeros_ops.modulePath + '/tpl/machine-block.tpl.html',
            success: function(source) {
                tpl.machine = source;
                callback();
            },
            dataType: 'html'
        });
    }
    loadMachineDetailTemplate = function() {
        $.ajax({
            url: Drupal.settings.xeros_ops.modulePath + '/tpl/machine-details.tpl.html',
            success: function(source) {
                tpl.machineDetail = source;
            },
            dataType: 'html'
        })
    };

    renderDetail = function(machineId) {

        var template = Handlebars.compile(tpl.machineDetail);

        var clickedMachineData = data.machineSource[machineId];
//
        var machineDetailData = loadHistory(machineId, function(d, machineId) {

            var templateData = {
                currentStatus: d.slice(0,1),
                history: d.slice(1,6),  // Just first five rows of data
                machine: clickedMachineData};

            console.log(templateData);
            var html = template(templateData);

            jQuery('.machine-detail').html(html);

            bindDetailEvents();
        });


    };

    renderStatus = function() {
        console.log("Ready to render");

        // Compile Template
        var template = Handlebars.compile(tpl.machine);

        // Render Template
        var html = template(data.machine);

        jQuery('.machine-status').html(html);

        bindEvents();

    };

    showMachine = function(machineId) {

        renderDetail(machineId);

        $('.machine-detail').addClass('show');
    };

    bindDetailEvents = function() {
        // Close machine details
        $('.machine-detail__close').on('click', function() {
            $(this).closest('.machine-detail').removeClass('show');
        });

        // Show the log
        $('.log__open-close').on('click', function() {
            $('.log').toggleClass('show');
            $(this).toggleClass('rotate');
        });
    };

    bindEvents = function() {

        els.alerts =      $('.machine');

        // Show machine details
        els.alerts.on('click', function() {
            // Rerender with new data
           showMachine($(this).data('machine-id'));
        });



        // Toggle key display
        $('.page-ops__key').on('click', function() {
            $(this).toggleClass('show');
        });

        // Filter results
        $('.controls.filter').on('click', function() {
            var filter = $(this).data('filter');
            $(this).toggleClass('hide');
            $('.machine__wrapper.' + filter).parent().toggleClass('hide');
        });

        // Change Display
        $('.controls.display-type').on('click', function() {
            var display = $(this).data('display-type');
            $('body')
                .removeClass(function(index, css) {
                    return (css.match (/(^|\s)display-\S+/g) || []).join(' ');
                })
                .addClass('display-' + display);
        });

        // Show Detail
        $('.controls.show-details').on('click', function() {
            $('body').toggleClass('show-details');
            $(this).toggleClass('active');
        });

        // Show Detail
        $('.controls.show-label').on('click', function() {
            $('body').toggleClass('show-label');
            $(this).toggleClass('active');
        });

        // Toggle Full Screen
        $('.controls.full-screen').on('click', function() {

            if (FF.Utils.fullscreenElement() !== null) {
                FF.Utils.exitFullscreen();
            } else {
                FF.Utils.launchFullscreen(document.documentElement);
            }

            $('body').toggleClass('full-screen');
            $(this).toggleClass('active');
        })
    }

    function updateCountdown() {

        $('.refresh-timestamp .refresh-timestamp__data').html(String(Date()));

        //$('.countdown-timer').html('');
        $('.countdown-timer').countdown('destroy');
        $('.countdown-timer').countdown({until: +refreshInterval,
            format: 'MS',
            compact: true,
            layout: 'Data refresh in {mnn}:{snn}'
        });
    }

    function registerHelpers() {
        Handlebars.registerHelper('dateFormat', function(context, block) {
            console.log(context);
            var d = new Date(context);
            console.log(d);
            if (window.moment) {
                var f = block.hash.format || "MMM Do, YYYY";

                return moment(d).format(f);
            }else{
                return context;   //  moment plugin not available. return data as is.
            };
        });

        Handlebars.registerHelper('statusFormat', function(statusCode, format) {
            if (format == 'color') {
                if (statusCode > 0) {
                    return 'green';
                } else if (statusCode == 0) {
                    return 'yellow';
                } else if (statusCode < 0 ) {
                    return 'red';
                } else {
                    return 'red';
                }
            } else if (format == 'code') {
                if (statusCode > 0) {
                    return 'OK';
                } else if (statusCode == 0) {
                    return 'idle';
                } else if (statusCode < 0 ) {
                    return 'fault';
                } else {
                    return 'fault';
                }
            } else {
                return statusCode;
            }
        });

        Handlebars.registerHelper('runTimeFormat', function(seconds) {

            seconds = Math.round(seconds);

            var hours = Math.floor(seconds / 3600);
            seconds = seconds - hours * 3600;

            var minutes = Math.floor(seconds / 60);
            var seconds = seconds - minutes * 60;

            var time = "";
            if (hours > 0) {
                time = hours.toString() + ":" + minutes.toString() + ":" + seconds.toString();
            } else {
                time = minutes.toString() + ":" + seconds.toString();
            }
            return time;
        });
    }

    function refreshDisplay() {

        //  format an ISO date using Moment.js
//  http://momentjs.com/
//  moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
//  usage: {{dateFormat creation_date format="MMMM YYYY"}}


        loadData(function() {
            formatData();
            renderStatus();
        });

        updateCountdown();

    }
    /**
     * Function: CC.Form.init
     *   Initializes header functionality
     *
     *   Returns:
     *     nothing
     */
    pub.init = function() {

        load = 0;
        // Reference the window object
        win = $(window);
        doc = $(document);
        body = $('body');

        //services = Drupal.settings.services;


        registerHelpers();

        loadMachineDetailTemplate();

        loadMachineTemplate(function() {
            refreshDisplay();
        });


        updateCountdown();

        if ( refresh ) {
            setInterval(function () {
                refreshDisplay();
            }, refreshInterval * 1000);
        }

        $('html').css('padding-bottom', '0');

        $('body').addClass('display-icon');

    }

    return pub;

})(jQuery);

var windowStatus = {};

var windowHistory = {};



jQuery(document).ready(FF.Hud.init);

