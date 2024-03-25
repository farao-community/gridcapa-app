/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReportViewer from './report-viewer/report-viewer';

const ComputingType = {
    LOAD_FLOW: 'LOAD_FLOW',
    SECURITY_ANALYSIS: 'SECURITY_ANALYSIS',
    SENSITIVITY_ANALYSIS: 'SENSITIVITY_ANALYSIS',
    NON_EVACUATED_ENERGY_ANALYSIS: 'NON_EVACUATED_ENERGY_ANALYSIS',
    SHORT_CIRCUIT: 'SHORT_CIRCUIT',
    SHORT_CIRCUIT_ONE_BUS: 'SHORT_CIRCUIT_ONE_BUS',
    DYNAMIC_SIMULATION: 'DYNAMIC_SIMULATION',
    VOLTAGE_INITIALIZATION: 'VOLTAGE_INITIALIZATION',
    STATE_ESTIMATION: 'STATE_ESTIMATION',
};

const REPORT_TYPES = {
    ...ComputingType,
    NETWORK_MODIFICATION: 'NETWORK_MODIFICATION',
};

export const GLOBAL_NODE_TASK_KEY = 'Logs';

function fetchSubReport(studyUuid, nodeUuid, reportId, severityFilterList) {
    console.info(
        'get subReport with Id : ' +
            reportId +
            ' with severities ' +
            severityFilterList
    );

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(subReport);
        }, 1000);
    });
}

function fetchNodeReport(
    studyUuid,
    nodeUuid,
    reportId,
    severityFilterList,
    reportType
) {
    console.info(
        'get report for node : ' +
            nodeUuid +
            ' in study ' +
            studyUuid +
            ' for ' +
            reportType
    );

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(nodeReport);
        }, 1000);
    });
}

function fetchParentNodesReport(
    studyUuid,
    nodeUuid,
    nodeOnlyReport,
    severityFilterList,
    reportType
) {
    console.info(
        'get node report with its parent for : ' +
            nodeUuid +
            ' with nodeOnlyReport = ' +
            nodeOnlyReport +
            ' in study ' +
            studyUuid +
            ' for ' +
            reportType
    );

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(parentNodesReport);
        }, 1000);
    });
}

function StructuredLogsView({ logsTree }) {
    const subReportPromise = (reportId, severityFilterList) => {
        return fetchSubReport(1, 2, reportId, severityFilterList);
    };

    const nodeReportPromise = (nodeId, reportId, severityFilterList) => {
        return fetchNodeReport(
            1,
            nodeId,
            reportId,
            severityFilterList,
            REPORT_TYPES.NETWORK_MODIFICATION
        );
    };

    const globalReportPromise = (severityFilterList) => {
        return fetchParentNodesReport(
            1,
            2,
            false,
            severityFilterList,
            REPORT_TYPES.NETWORK_MODIFICATION
        );
    };

    return (
        <>
            <ReportViewer
                jsonReportTree={nodeReport}
                subReportPromise={subReportPromise}
                nodeReportPromise={nodeReportPromise}
                globalReportPromise={globalReportPromise}
            />
        </>
    );
}

StructuredLogsView.propTypes = {
    logsTree: PropTypes.object.isRequired,
};

export default StructuredLogsView;

const subReport = {
    messageKey: 'dc5d9012-fd3b-412c-a73b-d2d2def17f9f',
    children: [
        {
            messageKey: 'VOLTAGE_LEVEL_MODIFICATION',
            children: [
                {
                    messageKey: 'voltageLevelModification',
                    children: [],
                    values: {
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        id: {
                            value: 'vl1',
                            type: 'UNTYPED',
                        },
                    },
                    message: 'Voltage level with id=vl1 modified :',
                    messageTemplate: 'Voltage level with id=${id} modified :',
                },
                {
                    messageKey: 'modification-indent1',
                    children: [],
                    values: {
                        newValue: {
                            value: 'Jordif',
                            type: 'UNTYPED',
                        },
                        fieldName: {
                            value: 'Name',
                            type: 'UNTYPED',
                        },
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        oldValue: {
                            value: 'No value',
                            type: 'UNTYPED',
                        },
                    },
                    message: '\tName : No value → Jordif',
                    messageTemplate:
                        '\t${fieldName} : ${oldValue} → ${newValue}',
                },
            ],
            values: {
                voltageLevelId: {
                    value: 'vl1',
                    type: 'UNTYPED',
                },
                subReportId: {
                    value: 'dc5d9012-fd3b-412c-a73b-d2d2def17f9f',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[INFO]',
                    type: 'UNTYPED',
                },
            },
            message: 'VoltageLevel modification vl1',
            messageTemplate: 'VoltageLevel modification ${voltageLevelId}',
        },
    ],
    values: {},
    message: 'dc5d9012-fd3b-412c-a73b-d2d2def17f9f',
    messageTemplate: 'dc5d9012-fd3b-412c-a73b-d2d2def17f9f',
};

const nodeReport = {
    messageKey: "N1 donc c'est plus long que prévu la vache",
    children: [
        {
            messageKey: 'VOLTAGE_LEVEL_MODIFICATION',
            children: [
                {
                    messageKey: 'voltageLevelModification',
                    children: [],
                    values: {
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        id: {
                            value: 'vl1',
                            type: 'UNTYPED',
                        },
                    },
                    message: 'Voltage level with id=vl1 modified :',
                    messageTemplate: 'Voltage level with id=${id} modified :',
                },
                {
                    messageKey: 'modification-indent1',
                    children: [],
                    values: {
                        newValue: {
                            value: 'Jordif',
                            type: 'UNTYPED',
                        },
                        fieldName: {
                            value: 'Name',
                            type: 'UNTYPED',
                        },
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        oldValue: {
                            value: 'No value',
                            type: 'UNTYPED',
                        },
                    },
                    message: '\tName : No value → Jordif',
                    messageTemplate:
                        '\t${fieldName} : ${oldValue} → ${newValue}',
                },
            ],
            values: {
                voltageLevelId: {
                    value: 'vl1',
                    type: 'UNTYPED',
                },
                subReportId: {
                    value: 'dc5d9012-fd3b-412c-a73b-d2d2def17f9f',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[INFO]',
                    type: 'UNTYPED',
                },
            },
            message: 'VoltageLevel modification vl1',
            messageTemplate: 'VoltageLevel modification ${voltageLevelId}',
        },
        {
            messageKey: 'EQUIPMENT_ATTRIBUTE_MODIFICATION',
            children: [
                {
                    messageKey: 'switchChanged',
                    children: [],
                    values: {
                        voltageLevelId: {
                            value: 'vl1',
                            type: 'UNTYPED',
                        },
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        id: {
                            value: 'br2',
                            type: 'UNTYPED',
                        },
                        operation: {
                            value: 'Opening',
                            type: 'UNTYPED',
                        },
                    },
                    message: "Opening switch 'br2' in voltage level vl1",
                    messageTemplate:
                        "${operation} switch '${id}' in voltage level ${voltageLevelId}",
                },
            ],
            values: {
                EquipmentId: {
                    value: 'br2',
                    type: 'UNTYPED',
                },
                subReportId: {
                    value: 'd1baf826-1df5-4567-8dc1-200534a0e4c2',
                    type: 'UNTYPED',
                },
                EquipmentType: {
                    value: 'SWITCH',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[INFO]',
                    type: 'UNTYPED',
                },
            },
            message: "SWITCH 'br2' change",
            messageTemplate: "${EquipmentType} '${EquipmentId}' change",
        },
        {
            messageKey: 'EQUIPMENT_ATTRIBUTE_MODIFICATION',
            children: [],
            values: {
                EquipmentId: {
                    value: 'br2',
                    type: 'UNTYPED',
                },
                subReportId: {
                    value: 'a4a2f6ce-aec5-4e46-8ea8-044bbd820940',
                    type: 'UNTYPED',
                },
                EquipmentType: {
                    value: 'SWITCH',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[]',
                    type: 'UNTYPED',
                },
            },
            message: "SWITCH 'br2' change",
            messageTemplate: "${EquipmentType} '${EquipmentId}' change",
        },
        {
            messageKey: 'EQUIPMENT_ATTRIBUTE_MODIFICATION',
            children: [
                {
                    messageKey: 'switchChanged',
                    children: [],
                    values: {
                        voltageLevelId: {
                            value: 'vl1',
                            type: 'UNTYPED',
                        },
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        id: {
                            value: 'br2',
                            type: 'UNTYPED',
                        },
                        operation: {
                            value: 'Closing',
                            type: 'UNTYPED',
                        },
                    },
                    message: "Closing switch 'br2' in voltage level vl1",
                    messageTemplate:
                        "${operation} switch '${id}' in voltage level ${voltageLevelId}",
                },
            ],
            values: {
                EquipmentId: {
                    value: 'br2',
                    type: 'UNTYPED',
                },
                subReportId: {
                    value: '06f70ac9-8f70-4923-b7a5-e63cf8663a4b',
                    type: 'UNTYPED',
                },
                EquipmentType: {
                    value: 'SWITCH',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[INFO]',
                    type: 'UNTYPED',
                },
            },
            message: "SWITCH 'br2' change",
            messageTemplate: "${EquipmentType} '${EquipmentId}' change",
        },
        {
            messageKey: 'GENERATION_DISPATCH',
            children: [
                {
                    messageKey: 'Network CC0 SC0',
                    children: [
                        {
                            messageKey: 'PowerToDispatch',
                            children: [
                                {
                                    messageKey: 'TotalDemand0',
                                    children: [],
                                    values: {
                                        reportSeverity: {
                                            value: 'INFO',
                                            type: 'UNTYPED',
                                        },
                                        totalDemand: {
                                            value: '198.0',
                                            type: 'UNTYPED',
                                        },
                                    },
                                    message: 'The total demand is : 198.0 MW',
                                    messageTemplate:
                                        'The total demand is : ${totalDemand} MW',
                                },
                                {
                                    messageKey: 'TotalAmountFixedSupply0',
                                    children: [],
                                    values: {
                                        reportSeverity: {
                                            value: 'INFO',
                                            type: 'UNTYPED',
                                        },
                                        totalAmountFixedSupply: {
                                            value: '0.0',
                                            type: 'UNTYPED',
                                        },
                                    },
                                    message:
                                        'The total amount of fixed supply is : 0.0 MW',
                                    messageTemplate:
                                        'The total amount of fixed supply is : ${totalAmountFixedSupply} MW',
                                },
                                {
                                    messageKey: 'TotalOutwardHvdcFlow0',
                                    children: [],
                                    values: {
                                        reportSeverity: {
                                            value: 'INFO',
                                            type: 'UNTYPED',
                                        },
                                        hvdcBalance: {
                                            value: '0.0',
                                            type: 'UNTYPED',
                                        },
                                    },
                                    message: 'The HVDC balance is : 0.0 MW',
                                    messageTemplate:
                                        'The HVDC balance is : ${hvdcBalance} MW',
                                },
                                {
                                    messageKey: 'TotalActiveBatteryTargetP0',
                                    children: [],
                                    values: {
                                        batteryBalance: {
                                            value: '0.0',
                                            type: 'UNTYPED',
                                        },
                                        reportSeverity: {
                                            value: 'INFO',
                                            type: 'UNTYPED',
                                        },
                                    },
                                    message: 'The battery balance is : 0.0 MW',
                                    messageTemplate:
                                        'The battery balance is : ${batteryBalance} MW',
                                },
                                {
                                    messageKey:
                                        'TotalAmountSupplyToBeDispatched0',
                                    children: [],
                                    values: {
                                        totalAmountSupplyToBeDispatched: {
                                            value: '198.0',
                                            type: 'UNTYPED',
                                        },
                                        reportSeverity: {
                                            value: 'INFO',
                                            type: 'UNTYPED',
                                        },
                                    },
                                    message:
                                        'The total amount of supply to be dispatched is : 198.0 MW',
                                    messageTemplate:
                                        'The total amount of supply to be dispatched is : ${totalAmountSupplyToBeDispatched} MW',
                                },
                                {
                                    messageKey: 'NbGeneratorsWithNoCost0',
                                    children: [],
                                    values: {
                                        reportSeverity: {
                                            value: 'INFO',
                                            type: 'UNTYPED',
                                        },
                                        nbNoCost: {
                                            value: '1',
                                            type: 'UNTYPED',
                                        },
                                        isPlural: {
                                            value: ' has',
                                            type: 'UNTYPED',
                                        },
                                    },
                                    message:
                                        '1 generator has been discarded from generation dispatch because of missing marginal cost. Their active power set point has been set to 0',
                                    messageTemplate:
                                        '${nbNoCost} generator${isPlural} been discarded from generation dispatch because of missing marginal cost. Their active power set point has been set to 0',
                                },
                                {
                                    messageKey:
                                        'NoAvailableAdjustableGenerator0',
                                    children: [],
                                    values: {
                                        reportSeverity: {
                                            value: 'WARN',
                                            type: 'UNTYPED',
                                        },
                                    },
                                    message: 'There is no adjustable generator',
                                    messageTemplate:
                                        'There is no adjustable generator',
                                },
                            ],
                            values: {
                                subReportId: {
                                    value: 'b5b6c118-8312-47e3-9771-531d055f7920',
                                    type: 'UNTYPED',
                                },
                                severityList: {
                                    value: '[INFO, TRACE, WARN]',
                                    type: 'UNTYPED',
                                },
                            },
                            message: 'PowerToDispatch',
                            messageTemplate: 'PowerToDispatch',
                        },
                        {
                            messageKey: 'Result',
                            children: [
                                {
                                    messageKey:
                                        'SupplyDemandBalanceCouldNotBeMet0',
                                    children: [],
                                    values: {
                                        remainingPower: {
                                            value: '198.0',
                                            type: 'UNTYPED',
                                        },
                                        reportSeverity: {
                                            value: 'WARN',
                                            type: 'UNTYPED',
                                        },
                                    },
                                    message:
                                        'The supply-demand balance could not be met : the remaining power imbalance is 198.0 MW',
                                    messageTemplate:
                                        'The supply-demand balance could not be met : the remaining power imbalance is ${remainingPower} MW',
                                },
                            ],
                            values: {
                                subReportId: {
                                    value: '2f6d78f0-2b9e-42b7-a7c9-5d8e93d04848',
                                    type: 'UNTYPED',
                                },
                                severityList: {
                                    value: '[WARN]',
                                    type: 'UNTYPED',
                                },
                            },
                            message: 'Result',
                            messageTemplate: 'Result',
                        },
                    ],
                    values: {
                        subReportId: {
                            value: '8e0aba64-8f2b-4815-afa1-f539fc0a802d',
                            type: 'UNTYPED',
                        },
                        severityList: {
                            value: '[]',
                            type: 'UNTYPED',
                        },
                    },
                    message: 'Network CC0 SC0',
                    messageTemplate: 'Network CC0 SC0',
                },
                {
                    messageKey: 'NbSynchronousComponents',
                    children: [],
                    values: {
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        scNumber: {
                            value: '1',
                            type: 'UNTYPED',
                        },
                        isPlural: {
                            value: '',
                            type: 'UNTYPED',
                        },
                        scList: {
                            value: 'SC0',
                            type: 'UNTYPED',
                        },
                    },
                    message: 'Network has 1 synchronous component: SC0',
                    messageTemplate:
                        'Network has ${scNumber} synchronous component${isPlural}: ${scList}',
                },
            ],
            values: {
                subReportId: {
                    value: '2e8883ea-ef3f-4913-a05c-4e83580b075d',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[INFO]',
                    type: 'UNTYPED',
                },
            },
            message: 'Generation dispatch',
            messageTemplate: 'Generation dispatch',
        },
        {
            messageKey: 'EQUIPMENT_ATTRIBUTE_MODIFICATION',
            children: [
                {
                    messageKey: 'switchChanged',
                    children: [],
                    values: {
                        voltageLevelId: {
                            value: 'vl1',
                            type: 'UNTYPED',
                        },
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        id: {
                            value: 'br3',
                            type: 'UNTYPED',
                        },
                        operation: {
                            value: 'Opening',
                            type: 'UNTYPED',
                        },
                    },
                    message: "Opening switch 'br3' in voltage level vl1",
                    messageTemplate:
                        "${operation} switch '${id}' in voltage level ${voltageLevelId}",
                },
            ],
            values: {
                EquipmentId: {
                    value: 'br3',
                    type: 'UNTYPED',
                },
                subReportId: {
                    value: '49f55d26-ce42-4ff8-866d-100d0b761e42',
                    type: 'UNTYPED',
                },
                EquipmentType: {
                    value: 'SWITCH',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[INFO]',
                    type: 'UNTYPED',
                },
            },
            message: "SWITCH 'br3' change",
            messageTemplate: "${EquipmentType} '${EquipmentId}' change",
        },
        {
            messageKey: 'EQUIPMENT_ATTRIBUTE_MODIFICATION',
            children: [],
            values: {
                EquipmentId: {
                    value: 'br2',
                    type: 'UNTYPED',
                },
                subReportId: {
                    value: '64b96d2d-a3a6-4af6-8053-e8c0fb7f1f72',
                    type: 'UNTYPED',
                },
                EquipmentType: {
                    value: 'SWITCH',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[]',
                    type: 'UNTYPED',
                },
            },
            message: "SWITCH 'br2' change",
            messageTemplate: "${EquipmentType} '${EquipmentId}' change",
        },
        {
            messageKey: 'EQUIPMENT_ATTRIBUTE_MODIFICATION',
            children: [
                {
                    messageKey: 'switchChanged',
                    children: [],
                    values: {
                        voltageLevelId: {
                            value: 'vl2',
                            type: 'UNTYPED',
                        },
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        id: {
                            value: 'br5',
                            type: 'UNTYPED',
                        },
                        operation: {
                            value: 'Opening',
                            type: 'UNTYPED',
                        },
                    },
                    message: "Opening switch 'br5' in voltage level vl2",
                    messageTemplate:
                        "${operation} switch '${id}' in voltage level ${voltageLevelId}",
                },
            ],
            values: {
                EquipmentId: {
                    value: 'br5',
                    type: 'UNTYPED',
                },
                subReportId: {
                    value: '243c2b21-8395-4060-8e75-1ac23d075341',
                    type: 'UNTYPED',
                },
                EquipmentType: {
                    value: 'SWITCH',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[INFO]',
                    type: 'UNTYPED',
                },
            },
            message: "SWITCH 'br5' change",
            messageTemplate: "${EquipmentType} '${EquipmentId}' change",
        },
        {
            messageKey: 'EQUIPMENT_ATTRIBUTE_MODIFICATION',
            children: [
                {
                    messageKey: 'switchChanged',
                    children: [],
                    values: {
                        voltageLevelId: {
                            value: 'vl2',
                            type: 'UNTYPED',
                        },
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        id: {
                            value: 'br5',
                            type: 'UNTYPED',
                        },
                        operation: {
                            value: 'Closing',
                            type: 'UNTYPED',
                        },
                    },
                    message: "Closing switch 'br5' in voltage level vl2",
                    messageTemplate:
                        "${operation} switch '${id}' in voltage level ${voltageLevelId}",
                },
            ],
            values: {
                EquipmentId: {
                    value: 'br5',
                    type: 'UNTYPED',
                },
                subReportId: {
                    value: '2b501cf4-2df9-4616-80b6-ddc41a59ca87',
                    type: 'UNTYPED',
                },
                EquipmentType: {
                    value: 'SWITCH',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[INFO]',
                    type: 'UNTYPED',
                },
            },
            message: "SWITCH 'br5' change",
            messageTemplate: "${EquipmentType} '${EquipmentId}' change",
        },
        {
            messageKey: 'EQUIPMENT_ATTRIBUTE_MODIFICATION',
            children: [
                {
                    messageKey: 'switchChanged',
                    children: [],
                    values: {
                        voltageLevelId: {
                            value: 'vl1',
                            type: 'UNTYPED',
                        },
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        id: {
                            value: 'br2',
                            type: 'UNTYPED',
                        },
                        operation: {
                            value: 'Opening',
                            type: 'UNTYPED',
                        },
                    },
                    message: "Opening switch 'br2' in voltage level vl1",
                    messageTemplate:
                        "${operation} switch '${id}' in voltage level ${voltageLevelId}",
                },
            ],
            values: {
                EquipmentId: {
                    value: 'br2',
                    type: 'UNTYPED',
                },
                subReportId: {
                    value: 'f3c4d170-ce23-4a72-ac9f-61009f805fab',
                    type: 'UNTYPED',
                },
                EquipmentType: {
                    value: 'SWITCH',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[INFO]',
                    type: 'UNTYPED',
                },
            },
            message: "SWITCH 'br2' change",
            messageTemplate: "${EquipmentType} '${EquipmentId}' change",
        },
        {
            messageKey: 'EQUIPMENT_ATTRIBUTE_MODIFICATION',
            children: [
                {
                    messageKey: 'switchChanged',
                    children: [],
                    values: {
                        voltageLevelId: {
                            value: 'vl1',
                            type: 'UNTYPED',
                        },
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        id: {
                            value: 'br2',
                            type: 'UNTYPED',
                        },
                        operation: {
                            value: 'Closing',
                            type: 'UNTYPED',
                        },
                    },
                    message: "Closing switch 'br2' in voltage level vl1",
                    messageTemplate:
                        "${operation} switch '${id}' in voltage level ${voltageLevelId}",
                },
            ],
            values: {
                EquipmentId: {
                    value: 'br2',
                    type: 'UNTYPED',
                },
                subReportId: {
                    value: '6469b64f-b677-4ae6-bef5-f835863ce35c',
                    type: 'UNTYPED',
                },
                EquipmentType: {
                    value: 'SWITCH',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[INFO]',
                    type: 'UNTYPED',
                },
            },
            message: "SWITCH 'br2' change",
            messageTemplate: "${EquipmentType} '${EquipmentId}' change",
        },
        {
            messageKey: 'EQUIPMENT_ATTRIBUTE_MODIFICATION',
            children: [
                {
                    messageKey: 'switchChanged',
                    children: [],
                    values: {
                        voltageLevelId: {
                            value: 'vl2',
                            type: 'UNTYPED',
                        },
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        id: {
                            value: 'br4',
                            type: 'UNTYPED',
                        },
                        operation: {
                            value: 'Opening',
                            type: 'UNTYPED',
                        },
                    },
                    message: "Opening switch 'br4' in voltage level vl2",
                    messageTemplate:
                        "${operation} switch '${id}' in voltage level ${voltageLevelId}",
                },
            ],
            values: {
                EquipmentId: {
                    value: 'br4',
                    type: 'UNTYPED',
                },
                subReportId: {
                    value: 'e56eacaf-5caf-4239-84d5-803a08db88b3',
                    type: 'UNTYPED',
                },
                EquipmentType: {
                    value: 'SWITCH',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[INFO]',
                    type: 'UNTYPED',
                },
            },
            message: "SWITCH 'br4' change",
            messageTemplate: "${EquipmentType} '${EquipmentId}' change",
        },
        {
            messageKey: 'EQUIPMENT_ATTRIBUTE_MODIFICATION',
            children: [
                {
                    messageKey: 'switchChanged',
                    children: [],
                    values: {
                        voltageLevelId: {
                            value: 'vl2',
                            type: 'UNTYPED',
                        },
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        id: {
                            value: 'br4',
                            type: 'UNTYPED',
                        },
                        operation: {
                            value: 'Closing',
                            type: 'UNTYPED',
                        },
                    },
                    message: "Closing switch 'br4' in voltage level vl2",
                    messageTemplate:
                        "${operation} switch '${id}' in voltage level ${voltageLevelId}",
                },
            ],
            values: {
                EquipmentId: {
                    value: 'br4',
                    type: 'UNTYPED',
                },
                subReportId: {
                    value: '7f380126-b87b-4be0-92c4-38f2b8086b4b',
                    type: 'UNTYPED',
                },
                EquipmentType: {
                    value: 'SWITCH',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[INFO]',
                    type: 'UNTYPED',
                },
            },
            message: "SWITCH 'br4' change",
            messageTemplate: "${EquipmentType} '${EquipmentId}' change",
        },
        {
            messageKey: 'EQUIPMENT_ATTRIBUTE_MODIFICATION',
            children: [
                {
                    messageKey: 'switchChanged',
                    children: [],
                    values: {
                        voltageLevelId: {
                            value: 'vl3',
                            type: 'UNTYPED',
                        },
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        id: {
                            value: 'br8',
                            type: 'UNTYPED',
                        },
                        operation: {
                            value: 'Opening',
                            type: 'UNTYPED',
                        },
                    },
                    message: "Opening switch 'br8' in voltage level vl3",
                    messageTemplate:
                        "${operation} switch '${id}' in voltage level ${voltageLevelId}",
                },
            ],
            values: {
                EquipmentId: {
                    value: 'br8',
                    type: 'UNTYPED',
                },
                subReportId: {
                    value: 'dac2c80a-2304-4336-a506-2bdbdb8706fa',
                    type: 'UNTYPED',
                },
                EquipmentType: {
                    value: 'SWITCH',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[INFO]',
                    type: 'UNTYPED',
                },
            },
            message: "SWITCH 'br8' change",
            messageTemplate: "${EquipmentType} '${EquipmentId}' change",
        },
        {
            messageKey: 'EQUIPMENT_ATTRIBUTE_MODIFICATION',
            children: [
                {
                    messageKey: 'switchChanged',
                    children: [],
                    values: {
                        voltageLevelId: {
                            value: 'vl3',
                            type: 'UNTYPED',
                        },
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        id: {
                            value: 'br8',
                            type: 'UNTYPED',
                        },
                        operation: {
                            value: 'Closing',
                            type: 'UNTYPED',
                        },
                    },
                    message: "Closing switch 'br8' in voltage level vl3",
                    messageTemplate:
                        "${operation} switch '${id}' in voltage level ${voltageLevelId}",
                },
            ],
            values: {
                EquipmentId: {
                    value: 'br8',
                    type: 'UNTYPED',
                },
                subReportId: {
                    value: 'c23873c5-0d68-4426-bcc0-c67644b51ef4',
                    type: 'UNTYPED',
                },
                EquipmentType: {
                    value: 'SWITCH',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[INFO]',
                    type: 'UNTYPED',
                },
            },
            message: "SWITCH 'br8' change",
            messageTemplate: "${EquipmentType} '${EquipmentId}' change",
        },
        {
            messageKey: 'LOAD_MODIFICATION',
            children: [
                {
                    messageKey: 'loadModification',
                    children: [],
                    values: {
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        id: {
                            value: 'l1',
                            type: 'UNTYPED',
                        },
                    },
                    message: 'Load with id=l1 modified :',
                    messageTemplate: 'Load with id=${id} modified :',
                },
                {
                    messageKey: 'modification-indent1',
                    children: [],
                    values: {
                        newValue: {
                            value: 'AUXILIARY',
                            type: 'UNTYPED',
                        },
                        fieldName: {
                            value: 'Type',
                            type: 'UNTYPED',
                        },
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        oldValue: {
                            value: 'UNDEFINED',
                            type: 'UNTYPED',
                        },
                    },
                    message: '\tType : UNDEFINED → AUXILIARY',
                    messageTemplate:
                        '\t${fieldName} : ${oldValue} → ${newValue}',
                },
                {
                    messageKey: 'modification-indent1',
                    children: [],
                    values: {
                        newValue: {
                            value: '700.0',
                            type: 'UNTYPED',
                        },
                        fieldName: {
                            value: 'Constant active power',
                            type: 'UNTYPED',
                        },
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        oldValue: {
                            value: '180.0',
                            type: 'UNTYPED',
                        },
                    },
                    message: '\tConstant active power : 180.0 → 700.0',
                    messageTemplate:
                        '\t${fieldName} : ${oldValue} → ${newValue}',
                },
            ],
            values: {
                loadId: {
                    value: 'l1',
                    type: 'UNTYPED',
                },
                subReportId: {
                    value: '11e31d18-9ff9-4df9-9483-3b376db80de6',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[INFO]',
                    type: 'UNTYPED',
                },
            },
            message: 'Load modification l1',
            messageTemplate: 'Load modification ${loadId}',
        },
    ],
    values: {
        subReportId: {
            value: '040970d6-2632-4829-ba31-8db59e1fd4bc',
            type: 'UNTYPED',
        },
    },
    message: "N1 donc c'est plus long que prévu la vache",
    messageTemplate: "N1 donc c'est plus long que prévu la vache",
};

const parentNodesReport = {
    messageKey: '5459210e-e6c7-4a66-910e-ad75a27f8fb1',
    children: [
        {
            messageKey: 'EQUIPMENT_ATTRIBUTE_MODIFICATION',
            children: [
                {
                    messageKey: 'switchChanged',
                    children: [],
                    values: {
                        voltageLevelId: {
                            value: 'vl2',
                            type: 'UNTYPED',
                        },
                        reportSeverity: {
                            value: 'INFO',
                            type: 'UNTYPED',
                        },
                        id: {
                            value: 'br4',
                            type: 'UNTYPED',
                        },
                        operation: {
                            value: 'Opening',
                            type: 'UNTYPED',
                        },
                    },
                    message: "Opening switch 'br4' in voltage level vl2",
                    messageTemplate:
                        "${operation} switch '${id}' in voltage level ${voltageLevelId}",
                },
            ],
            values: {
                EquipmentId: {
                    value: 'br4',
                    type: 'UNTYPED',
                },
                subReportId: {
                    value: '5459210e-e6c7-4a66-910e-ad75a27f8fb1',
                    type: 'UNTYPED',
                },
                EquipmentType: {
                    value: 'SWITCH',
                    type: 'UNTYPED',
                },
                severityList: {
                    value: '[INFO]',
                    type: 'UNTYPED',
                },
            },
            message: "SWITCH 'br4' change",
            messageTemplate: "${EquipmentType} '${EquipmentId}' change",
        },
    ],
    values: {},
    message: '5459210e-e6c7-4a66-910e-ad75a27f8fb1',
    messageTemplate: '5459210e-e6c7-4a66-910e-ad75a27f8fb1',
};
