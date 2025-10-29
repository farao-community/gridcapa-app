import {
    getInitialViewToSet,
    getUrlWithTimestampAndView,
} from './view-utils.js';

it('should get initial view', async () => {
    expect(getInitialViewToSet('2020-01-01', '11:30', 2)).toEqual(0);
    expect(getInitialViewToSet('2020-01-01', 'aaaaa', 2)).toEqual(1);
    expect(getInitialViewToSet('zzzzzz', 'aaaaa', 2)).toEqual(2);
});

it('should get url from timestamp and view', async () => {
    let timestamp = new Date(Date.UTC(2020, 0, 1));
    expect(getUrlWithTimestampAndView(timestamp, 99)).toEqual('/');
    expect(getUrlWithTimestampAndView(timestamp, 2)).toEqual('/global');
    expect(getUrlWithTimestampAndView(timestamp, 1)).toEqual(
        '/date/2020-01-01'
    );
    expect(getUrlWithTimestampAndView(timestamp, 0)).toEqual(
        '/utcDate/2020-01-01/utcTime/00:00'
    );
});
