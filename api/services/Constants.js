/**
 * This class is specifically created to add constants which can be used across the application
 * For more detail see consts.js
 * https://github.com/SportZing/node-consts
 *
 */

var consts = require('consts');

consts.define('COMMENT_ADD', 'add');
consts.define('COMMENT_REMOVE', 'remove');
consts.define('COMMENT_CHANGE', 'change');

consts.define('ENQ_STATUS_NPU', 'Not Picking Up');
consts.define('ENQ_STATUS_IN_PROGRESS', 'In Progress');
consts.define('ENQ_STATUS_CLOSED', 'Closed');
consts.define('ENQ_STATUS_TOOK_REQ', 'Took Requirements');
consts.define('ENQ_STATUS_VISITED', 'Visited');
consts.define('ENQ_STATUS_EWI', 'Expected Walk In');
consts.define('ENQ_STATUS_TO_CALL', 'To Call');
consts.define('ENQ_STATUS_ENROLLED', 'Enrolled');