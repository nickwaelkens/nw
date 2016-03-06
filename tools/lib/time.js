/* eslint-disable */

module.exports = {
  format: function (time) {
    return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
  }
};
