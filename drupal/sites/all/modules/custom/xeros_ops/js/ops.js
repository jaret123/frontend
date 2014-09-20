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

        //for (i = 0; i < data.machineSource.length; i++) {
        for (var i in data.machineSource) {
            if (data.machineSource.hasOwnProperty(i)) {

                //console.log(data.machineSource[i]);
                var m = data.machineSource[i];

                // If the company is not on the object yet, initialize it
                if ( typeof data.machine.companies[m.company_title] == 'undefined') {
                    data.machine.companies[m.company_title] = {
                        'locations' : {},
                        'company_title' : m.company_title,
                        faultCount: 0,
                        monitoredMachineCount: 0
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

                // If the machine is not offline, add to the list of monitored servers and check fault count
                if (m.machine_status !== "offline") {
                    data.machine.companies[m.company_title].monitoredMachineCount += 1;
                    if ( !checkNested(m, 'status', 'status_code') ||  m.status.status_code <= 0) {
                       data.machine.companies[m.company_title].faultCount += 1;
                    }
                }

                data.machine.companies[m.company_title].locations[m.location_title].machines[i] = m;
            }
        }

        // Sort the companies
        // TODO: We should probably reformat the whole data object as nested arrays instead of objects to allow
        // easier sorting

        var s = _.pairs(data.machine.companies);

        // Put sites with the fewest monitored machines at the bottom
        s = _.sortBy(s, function(obj) { return -(obj[1].monitoredMachineCount) } );

        // Put machines with the most faults at the top
        s = _.sortBy(s, function(obj) { return -(obj[1].faultCount) } );

        data.machine.companies = _.object(s);

        console.log(s);

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
        var _status = [];
        if ( typeof data !== "undefined" ) {
            _status = _.pairs(data);
            // Invert the order
            _status = _.sortBy(_status, function(obj) { return -(obj[0]) });
        }
        console.log('history', _status);
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
                for (var first in d) break;
                //data.details.history = d[first];
                data.details.history= formatHistory(d[first]);
                callback(machineId);
            },
            dataType: 'json',
            type: 'GET',
            contentType: 'application/json'
        });
    };

    loadCycles = function(machineId, callback) {
        jQuery.ajax({
            url: 'status-board-request/cycles/' + machineId.toString(),
            //data: '[' + machineId.toString() + ']',
            success: function(d) {
                for (var first in d) break;
                data.details.cycles = d[first];
                callback();
            },
            dataType: 'json',
            type: 'GET',
            contentType: 'application/json'
        });
    }

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

        // Reinitialize the details data
        data.details = {};

        // Pass the data for the machine that was clicked
        data.details.machine = data.machineSource[machineId];;

        // Load status history
        loadHistory(machineId, function(machineId) {

            loadCycles(machineId, function(d) {

                console.log(data.details);
                var html = template(data.details);

                jQuery('.machine-detail').html(html);

                bindDetailEvents();
            })

        });


    };

    renderStatus = function() {
        console.log("Ready to render");

        // Compile Template
        var template = Handlebars.compile(tpl.machine);

        // Render Template
        var html = template(data.machine);
        $('.machine-status').html(html);

        // Update totals in filters

        $('.controls.filter').each(function() {
            var filter = $(this).data('filter');
            var count = $('.machine__wrapper').filter('.' + filter).length;
            $(this).find('.controls__label').each(function () {
                $(this).html(count);
            });
            console.log(filter, count);
        });

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

            var myfilter = [];
            $('.controls.filter.hide').each(function() {
                myfilter.push('.' + $(this).data('filter'));
            });

            //var selector = '.machine__wrapper:not(' + myfilter.toString() + ')';

            //console.log(selector);

            // Remove the hide class
            $('.machine').removeClass('hide');
            // Add the hide class back;
            $('.machine__wrapper').filter(myfilter.toString())
                .parent().addClass('hide');
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

    function screenChangeHandler(){
        //NB the following line requrires the libary from John Dyer
        var fs = window.fullScreenApi.isFullScreen();
        console.log("f" + (fs ? 'yes' : 'no' ));
        if (fs) {
            $('body').addClass('full-screen');
        }
        else {
            $('body').removeClass('full-screen');
            $('.controls.full-screen').removeClass('active');
        }
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

    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
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

        Handlebars.registerHelper('statusFormat', function(statusCode, machineStatus, format) {
            if (format == 'color') {
                if (machineStatus == 'offline') {
                    return 'grey';
                } else {
                    if (statusCode > 0) {
                        return 'green';
                    } else if (statusCode == 0) {
                        return 'yellow';
                    } else if (statusCode < 0 ) {
                        return 'red';
                    } else {
                        return 'red';
                    }
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
                time = hours.toString() + ":" + minutes.toString() + ":" + pad(seconds.toString(),2);
            } else {
                time = minutes.toString() + ":" + pad(seconds.toString(),2);
            }
            return time;
        });

        Handlebars.registerHelper('round', function(number, decimalPlaces) {
            return Math.round(number * Math.pow(10, decimalPlaces)) / Math.pow(10,decimalPlaces);
        })
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

        // Add event listener to screenchange
        document.addEventListener("fullscreenchange", screenChangeHandler, false);
        document.addEventListener("webkitfullscreenchange", screenChangeHandler, false);
        document.addEventListener("mozfullscreenchange", screenChangeHandler, false);

    }

    return pub;

})(jQuery);

var windowStatus = {};

var windowHistory = {};



jQuery(document).ready(FF.Hud.init);

