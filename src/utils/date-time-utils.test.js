import {
    areSameDates,
    getDateString,
    getInitialTimestampToSet,
    getTimeString,
    plusOneDay,
    toISODate,
} from './date-time-utils.js';

it('should get initial timestamp to set', async () => {
    let res = new Date(getInitialTimestampToSet('2020-01-01', '11:45', 5));
    expect(res.getDate()).toEqual(1);
    expect(res.getUTCHours()).toEqual(11);
    expect(res.getMinutes()).toEqual(45);
});

it('should transform date to date and time string', async () => {
    let timestamp = Date.UTC(2020, 0, 1, 11, 45, 0);
    expect(getTimeString(new Date(timestamp))).toEqual('11:45');
    expect(getDateString(new Date(timestamp))).toEqual('2020-01-01');
});

it('should add one day', async () => {
    let timestamp = Date.UTC(2020, 0, 1);
    expect(new Date(plusOneDay(timestamp)).getDate()).toEqual(2);
});

it('should transform timestamp to ISO string', async () => {
    let timestamp = Date.UTC(2020, 0, 1);
    expect(toISODate(timestamp)).toEqual('2020-01-01');
});

it('should compare dates with or without different types', async () => {
    let timestamp = Date.UTC(2020, 0, 1);
    expect(
        areSameDates({ timestamp: timestamp }, { timestamp: timestamp })
    ).toBe(true);
    expect(
        areSameDates(
            { timestamp: '2020-01-01T00:00Z' },
            { timestamp: timestamp }
        )
    ).toBe(true);
    expect(
        areSameDates(
            { timestamp: '2025-01-01T00:00Z' },
            { timestamp: timestamp }
        )
    ).toBe(false);
});
