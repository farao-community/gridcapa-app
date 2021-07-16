import React from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";

export default function OverviewTable() {
    return(
        <TableContainer component={Paper}>
            <Table className="table">
                <TableHead>
                    <TableRow>
                        <TableCell>Inputs</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Filename</TableCell>
                        <TableCell>Latest modification</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell data-test="input-type">CGM</TableCell>
                        <TableCell data-test="input-status" style={{backgroundColor:'grey', color: 'white'}}>Absent</TableCell>
                        <TableCell data-test="input-filename"></TableCell>
                        <TableCell data-test="input-latest-modification"></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}