import { APP_NAME, COMMON_APP_NAME, getAppName } from './config-params.js';

it('should load correct appName', async () => {
    expect(getAppName('theme')).toEqual(COMMON_APP_NAME);
    expect(getAppName('bonjour')).toEqual(APP_NAME);
});
