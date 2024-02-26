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

export interface LpCampaign {
  campaignID: number;
  campaignName: string;
  status: string;
  payout: string;
  affiliateName: string;
  affiliateID: string;
}

interface CampaignListProps {
  campaignList: LpCampaign[];
}

interface RowProps {
  campaign: LpCampaign;
}

const Row = ({ campaign }: RowProps) => {
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
              'aria-labelledby': campaign.campaignID.toString(),
            }}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          {campaign.campaignName}
        </TableCell>
        <TableCell>{"ID: " + campaign.affiliateID + " - " + campaign.affiliateName}</TableCell>
        <TableCell align="right">123.44</TableCell>
        <TableCell align="right">123.44</TableCell>
        <TableCell align="right">123.44</TableCell>
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

const CampaignList = ({ campaignList }: CampaignListProps) => {
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell><strong>Toggle</strong></TableCell>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>Affiliate</strong></TableCell>
            <TableCell align="right"><strong>Curr.Bid</strong></TableCell>
            <TableCell align="right"><strong>Avg. Bid</strong></TableCell>
            <TableCell align="right"><strong>Data</strong></TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {campaignList.map((aff) => (
            <Row key={aff.campaignID} campaign={aff} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CampaignList