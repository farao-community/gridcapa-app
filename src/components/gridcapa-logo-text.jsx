import React from 'react';
import { Typography, useTheme } from '@mui/material';

function GridcapaLogoText() {
    const theme = useTheme();

    return (
        <Typography variant="h4">
            <span style={{ fontWeight: 'bold' }}>Grid</span>
            <span style={{ color: theme.palette.grey['500'] }}>Capa</span>
        </Typography>
    );
}

export default GridcapaLogoText;
