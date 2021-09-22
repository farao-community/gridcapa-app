import React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

export default function OverviewTable() {
    return (
        <TableContainer component={Paper}>
            <Table className="table">
                <TableHead>
                    <TableRow>
                        <TableCell><FormattedMessage id="inputs"/></TableCell>
                        <TableCell><FormattedMessage id="status"/></TableCell>
                        <TableCell><FormattedMessage id="filename"/></TableCell>
                        <TableCell><FormattedMessage id="latestModification"/></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell data-test="input-type">CGM</TableCell>
                        <TableCell
                            data-test="input-status"
                            style={{ backgroundColor: 'grey', color: 'white' }}
                        >
                            Absent
                        </TableCell>
                        <TableCell data-test="input-filename"></TableCell>
                        <TableCell data-test="input-latest-modification"></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
