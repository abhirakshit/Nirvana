define(function () {
    (function (Backbone) {
        var _sync = Backbone.sync;
        return Backbone.sync = function(method, entity, options) {
            if (options == null) {
                options = {};
            }
            var sync = _sync(method, entity, options);
            if (!entity._fetch && method === "read") {
                entity._fetch = sync;
            }
            return sync;
        };
    })(Backbone);
});
