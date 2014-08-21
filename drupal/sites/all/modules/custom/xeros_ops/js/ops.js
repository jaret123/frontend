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

    loadData = function() {
        // Grab the global data object and create a local copy so we can
        // refactor easily later;
        data.machineSource = xerosMachines;

        data.machine = {
            'companies' : {}
        };

        var j = 0;

        for (i = 0; i < data.machineSource.length; i++) {
            //console.log(data.machineSource[i]);
            var m = data.machineSource[i];

            if ( typeof data.machine.companies[m.company_title] == 'undefined') {
                data.machine.companies[m.company_title] = {
                    'locations' : {},
                    'company_title' : m.company_title
                };
            }
            if ( typeof data.machine.companies[m.company_title].locations[m.location_title] == 'undefined') {
                data.machine.companies[m.company_title].locations[m.location_title] = {
                    'machines' : {},
                    'location_title' : m.location_title,
                };
            }

            switch(j) {
                case 1:
                    m.status = 'green';
                    break;
                case 2:
                    m.status = 'yellow';
                    break;
                case 3:
                    m.status = 'red';
                    break;
                case 4:
                    m.status = 'blue';
                    j = 0;
                    break;
            }
            j++;
            data.machine.companies[m.company_title].locations[m.location_title].machines[m.machine_id] = m;


        }
        console.log (data.machine);
    };


    loadMachineTemplate = function(callback) {
        $.ajax({
            url: Drupal.settings.xeros_ops.modulePath + '/tpl/machine.tpl.html',
            success: function(source) {
                tpl.machine = source;
                callback();
            },
            dataType: 'html'
        });
    }
    loadMachineDetailTemplate = function(callback) {
        $.ajax({
            url: Drupal.settings.xeros_ops.modulePath + '/tpl/machine-details.tpl.html',
            success: function(source) {
                tpl.machineDetail = source;
                callback();
            },
            dataType: 'html'
        })
    };

    renderDetail = function() {

        var template = Handlebars.compile(tpl.machineDetail);

        var html = template({});

        jQuery('.machine-detail').html(html);

        bindEvents();

    };

    renderStatus = function() {
        console.log("Ready to render");

        // Compile Template
        var template = Handlebars.compile(tpl.machine);

        // Render Template
        var html = template(data.machine);

        jQuery('.machine-status').html(html);

    };

    bindEvents = function() {

        els.alerts =      $('.machine');

        // Hide and show right side view
        els.alerts.on('click', function() {
            // Rerender with new data
           $('.machine-detail').addClass('show');
        });

        $('.machine-detail__close').on('click', function() {
            $(this).closest('.machine-detail').removeClass('show');
        })
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

        loadData();

        // Load the templates
        loadMachineTemplate(renderStatus);

        loadMachineDetailTemplate(renderDetail);

        $('html').css('padding-bottom', '0');

        console.log(els.data);

    }

    return pub;

})(jQuery);

jQuery(document).ready(FF.Hud.init);

