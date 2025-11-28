var jasmineReporters = require('jasmine-reporters');
jasmine.VERBOSE = true;
jasmine.getEnv().addReporter(
    new jasmineReporters.JUnitXmlReporter({
                                              consolidateAll: true,
                                              savePath: "coverage/",
                                              filePrefix: "test-results"
                                          })
);