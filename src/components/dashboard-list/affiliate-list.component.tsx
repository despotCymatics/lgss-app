import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Checkbox } from '@mui/material';

export interface LpAffiliate {
  affiliateID: string; 
  affiliateName: string; 
  status: string; 
}

interface AffiliateListProps {
  affiliateList: LpAffiliate[];
}

interface RowProps {
  affiliate: LpAffiliate;
}

const Row = ({ affiliate }: RowProps) => {
  const [open, setOpen] = React.useState(false);
  // const isSelected = (id: number) => selected.indexOf(id) !== -1;
  // const isItemSelected = isSelected(row.id);
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            inputProps={{
              'aria-labelledby': affiliate.affiliateID,
            }}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          {affiliate.affiliateName}
        </TableCell>
        <TableCell align="right">Description</TableCell>
        <TableCell align="right">123</TableCell>
        <TableCell align="right">123444</TableCell>
        <TableCell align="right">link</TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                More Data
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const AffiliateList = ({affiliateList}: AffiliateListProps) => {
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell><strong>Toggle</strong></TableCell>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell align="right"><strong>Description</strong></TableCell>
            <TableCell align="right"><strong>Curr. Bid</strong></TableCell>
            <TableCell align="right"><strong>Avg. Bid</strong></TableCell>
            <TableCell align="right"><strong>Link</strong></TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {affiliateList.map((aff) => (
            <Row key={aff.affiliateID} affiliate={aff} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AffiliateList