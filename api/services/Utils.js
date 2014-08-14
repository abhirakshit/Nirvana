module.exports = {
    capitalizeFirst: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    logQueryError: function(err, model, msg, cb) {
        if (err) {
            console.log(err);
            return cb(err);
        }
        if (!model) {
            var error = new Error(msg);
            console.log(error);
            return cb(error);
        }
    }
};
