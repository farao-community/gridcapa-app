
export function formatTimeStamp(timestamp) {
    let date = new Date(timestamp).toLocaleString();        // This gives something like '01/01/2020 at 12:25:30' or '01/01/2020 à 12:25:30' depending on user's computer
    return date.substring(0, 10) + date.substring(12, 21);  // To avoid any confusion with the configured application language, this concatenates the local date with the local hour,
                                                            // Result is something like: '01/01/2020 12:25:30'
}
