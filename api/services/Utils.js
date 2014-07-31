module.exports = {
    capitalizeFirst: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    logQueryError: function(err, model, msg, cb) {
        if (err) return cb(err);
        if (!model) return cb(new Error(msg));
    }
};
