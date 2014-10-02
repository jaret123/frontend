var FF = FF || {};

FF.Controls = FF.Controls || {};

/**
 * FF - Controls-MachineNav
 *
 *
 * Created by jason on 10/1/14
 */
FF.Controls.MachineNav = (function ($) {

    var pub = {},
        els = {};

    // Public functions/objects
    pub.create = create;

    var machines = [];

    var currentMachineIndex;

    function create() {

        for (var key in app.data.data) {
            machines.push(key);
        };

        els.leftArrow = $("#machine").find(".caret-left-wrapper");
        els.rightArrow = $("#machine").find(".caret-right-wrapper");

        currentMachineIndex = machines.indexOf(app.machine);

        els.leftArrow.removeClass("active")
            .unbind();
        els.rightArrow.removeClass("active")
            .unbind();

        if (currentMachineIndex > 0) {
            els.leftArrow.addClass("active")
                .click(function () {
                    // TODO: Maybe move to FF.User.reportSettings
                    app.machine = machines[currentMachineIndex - 1];
                    app.updateHash();
                })
        }
        if (currentMachineIndex < (machines.length - 1)) {
            els.rightArrow.addClass("active")
                .click(function () {
                    app.machine = machines[currentMachineIndex + 1];
                    app.updateHash();
                })
        }
    }

    return pub;
})(jQuery);
