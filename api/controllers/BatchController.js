/**
 * BatchController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var _ = require('lodash'),
    async = require('async'),
    moment = require('moment'),
    consts = require('consts');

addStudents = function (batchId, staffId, newStudentIdArr, res) {
    async.waterfall(
        [
            function (callback) {
                //Add new students to the batch
                Batch.findOne(batchId).populate('students').exec(function (err, batch) {
                    if (err) {
                        callback(err);
                    }
                    /** For each student id, check if student is already enrolled
                     * If not then add student to the list
                     */
//                    var enrolledStudents = batch.students;
                    var existingStudentsIdArr = _.map(batch.students, function (student) {
                        return student.id;
                    });
                    var addedStudentIdArr = [];
                    _.forEach(newStudentIdArr, function (studentId) {
                        //Student already exists
                        if (_.contains(existingStudentsIdArr, studentId)) return;

                        //Add to list
                        batch.students.add(parseInt(studentId));
                        addedStudentIdArr.push(studentId);
                    });

                    batch.save(function (err, s) {
                        if (err) callback(err);
                        callback(null, batch.name, addedStudentIdArr);
                    });
                })
            },

            function (batchName, addedStudentIdArr, callback) {
                var commentStr = "Batch: " + batchName;
                //Create all comments before sending updated batch
                async.each(addedStudentIdArr, function (studentId, cb) {
                    UserService.createComment(staffId, studentId, commentStr, consts.COMMENT_ADD, cb);
                }, function (err) {
                    if (err) callback(err);
                    callback(null);
                });
            },

            function (callback) {
                Batch.findOne(batchId).
                    populate('students').
                    populate('service').
                    populate('classes').
                    exec(function (err, batch) {
                        if (err) callback(err);

                        callback(null, batch);
                    })
            }
        ],
        function (err, batch) {
            if (err || !batch) {
                console.log(err);
                return err;
            }

            return res.json(batch);
        }
    );
};

removeStudent = function (batchId, staffId, removeStudentId, res) {
    async.waterfall([
        function (callback) {
            Batch.findOne(batchId).populate('students').exec(function (err, batch) {
                if (err) {
                    callback(err);
                }

                batch.students.remove(parseInt(removeStudentId));
                batch.save(function (err, batch) {
                    if (err) callback(err);
                    callback(null, batch.name);
                });
            });
        },

        function (batchName, callback) {
            var commentStr = "Batch: " + batchName;
            UserService.createComment(staffId, removeStudentId, commentStr, consts.COMMENT_REMOVE, callback);
        },

        function (studentId, comment, callback) {
            Batch.findOne(batchId).
                populate('students').
                populate('service').
                populate('classes').
                exec(function (err, batch) {
                    if (err) callback(err);
                    callback(null, batch);
                })
        }
    ],
        function (err, batch) {
            if (err || !batch) {
                console.log(err);
                return err;
            }

            return res.json(batch);
        }
    );
};

module.exports = {

    find: function (req, res) {
        var id = req.param('id');
        if (!id) {
            // Find all batches
            BatchView.find().exec(function(err, batches) {
                if (err || !batches) {
                    return res.badRequest('Could not find batches');
                }

                return res.json(batches);
            })
        } else {
            Batch.findOne(id).
                populate('service').
                populate('students').
                populate('classes').
                exec(function (err, batch) {
                    if (err || !batch) {
                        console.log(err);
                        return res.badRequest('Could not find batch for id: ' + id);
                    }
                    res.json(batch);
                })
        }
    },

    create: function (req, res) {
        var batchId = req.param('id'),
            staffId = UserService.getCurrentStaffUserId(req);
        var batchAttr = _.merge({}, req.params.all(), req.body);
//        console.log(_.merge({}, req.params.all(), req.body));

        //Create batch
        Batch.create(batchAttr).exec(function (err, batch) {
            if (err || !batch) {
                return res.badRequest(err);
            }

            Batch.findOne(batch.id).
                populate('service').
//                populate('students').
//                populate('classes').
                exec(function (err, updatedBatch) {
                    if (err || !batch) {
                        return res.badRequest(err);
                    }
                    res.json(updatedBatch);
                })
        });

        //Create Comment about who created it

        //
    },

    updatePartial: function (req, res) {
        var batchId = req.param('id'),
            staffId = UserService.getCurrentStaffUserId(req);
//        console.log(_.merge({}, req.params.all(), req.body));
        if (!batchId) {
            return res.badRequest('No id provided.');
        } else if (req.body.addStudents) {
            addStudents(batchId, staffId, req.body.addStudents, res);
        } else if (req.body.removeStudent) {
            removeStudent(batchId, staffId, req.body.removeStudent, res);
        } else {
            var updateFields = _.merge({}, req.params.all(), req.body);
            Batch.update(batchId, updateFields, function (err, updated) {
                if (err) {
                    console.log("Could not update batch: " + batchId + "\n" + err);
                    return res.badRequest(err);
                }
                res.json(updated[0]);
            });
        }
    },

    getClasses: function (req, res) {
        var batchId = req.param('id');
        Class.find({'batch': batchId})
            .populate('staff')
            .populate('topic')
            .exec(function (err, classList) {
                if (err) {
                    return res.json(err);
                }

                res.json(classList);
            });
    },

    getCurrentBatches: function (req, res) {
        BatchView.find({endDate: { '>': moment().toDate()}})
//            .populate('service')
//            .populate('classes')
//            .populate('students')
            .exec(function (err, batchList) {
                if (err || !batchList) {
                    return res.badRequest(err);
                }

                res.json(batchList);
            })
    }
};
