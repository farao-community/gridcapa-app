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
