
export function formatTimeStamp(timestamp) {
    let date = new Date(timestamp).toLocaleString();
    return date.substring(0, 10) + date.substring(12, 21);
}
