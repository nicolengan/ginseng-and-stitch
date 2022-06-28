const moment = require('moment');

const formatDate = function (date, targetFormat) {
    return moment(date).format(targetFormat);
};

const replaceCommas = function(value) {
    return value ? value.replace(/,/g, ' | ') : 'None';
};

// const radioCheck = function (value, radioValue) {
//     return (value == radioValue) ? 'checked' : '';
// };

const checkValue = function (value, classesValue) {
    return (value == classesValue) ? 'checked' : '';
};

const selectCheck = function (value, selectValue) {
    return (value == selectValue) ? 'checked' : '';
};

const ifEqual = function (a , b, options)
{
    if (a == b) { return options.fn(this); }
    return options.inverse(this);
;}

module.exports = { formatDate, replaceCommas, ifEqual};
