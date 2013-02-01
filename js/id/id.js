window.iD = function () {
    var context = {},
        history = iD.History(),
        connection = iD.Connection(),
        dispatch = d3.dispatch('enter', 'exit'),
        mode,
        container,
        ui = iD.ui(context),
        map = iD.Map(context);

    /* Straight accessors. Avoid using these if you can. */
    context.ui         = function () { return ui; };
    context.connection = function () { return connection; };
    context.history    = function () { return history; };
    context.map        = function () { return map; };

    /* History */
    context.graph   = history.graph;
    context.perform = history.perform;
    context.replace = history.replace;
    context.pop     = history.pop;
    context.undo    = history.undo;
    context.redo    = history.undo;
    context.changes = history.changes;

    /* Graph */
    context.entity = function (id) {
        return history.graph().entity(id);
    };

    context.geometry = function (id) {
        return context.entity(id).geometry(history.graph());
    };

    /* Modes */
    context.enter = function(newMode) {
        if (mode) {
            mode.exit();
            dispatch.exit(mode);
        }

        mode = newMode;
        mode.enter();
        dispatch.enter(mode);
    };

    context.mode = function() {
        return mode;
    };

    /* Behaviors */
    context.install = function (behavior) {
        context.surface().call(behavior);
    };

    context.uninstall = function (behavior) {
        context.surface().call(behavior.off);
    };

    /* Map */
    context.background = function () { return map.background; };
    context.surface    = function () { return map.surface; };
    context.projection = map.projection;
    context.tail       = map.tail;
    context.redraw     = map.redraw;

    context.container = function (_) {
        if (!arguments.length) return container;
        container = _;
        return context;
    };

    context.background()
        .source(iD.BackgroundSource.Bing);

    return d3.rebind(context, dispatch, 'on');
};

iD.version = '0.0.0-alpha1';

iD.supported = function() {
    if (navigator.appName !== 'Microsoft Internet Explorer') {
        return true;
    } else {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
        if (re.exec(ua) !== null) {
            rv = parseFloat( RegExp.$1 );
        }
        if (rv && rv < 9) return false;
        else return true;
    }
};
