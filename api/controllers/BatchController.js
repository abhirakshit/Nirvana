/**
 * BatchController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    updatePartial: function (req, res) {
        var id = req.param('id');
//        console.log(_.merge({}, req.params.all(), req.body));
        if (!id) {
            return res.badRequest('No id provided.');
        } else {
            var updateFields = _.merge({}, req.params.all(), req.body);
            Batch.update(id, updateFields, function (err, updated) {
                if (err) {
                    console.log("Could not update batch: " + id + "\n" + err);
                    return res.badRequest(err);
                }
                res.json(updated[0]);
            });
        }
    }
	
};
