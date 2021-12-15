const crypto = require('crypto');

export const sha256 = (x) =>
    crypto.createHash('sha256').update(x, 'utf8').digest('hex'); // UTF8 text hash

export function formatTimeStamp(timestamp) {
    let date = new Date(timestamp);
    let formattedDate =
        date.getDay() +
        '/' +
        date.getMonth() +
        '/' +
        date.getFullYear() +
        '  ' +
        date.getHours() +
        ':' +
        date.getMinutes() +
        ':' +
        date.getSeconds();

    return formattedDate;
}
