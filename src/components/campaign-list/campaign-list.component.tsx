import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Button, Card, CardActions, CardContent, CardHeader, Checkbox, Divider, FilledInput, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, Switch, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import { fetchCampaignInfo, fetchContractFieldRevenueRules } from '../../utils/leadspedia/api';

export interface LpCampaign {
  campaignID: number;
  campaignName: string;
  status: string;
  payout: string;
  affiliateName: string;
  affiliateID: string;
  offerID: string;
}

interface CampaignListProps {
  campaignList: LpCampaign[];
}

interface CampaignInfo {
  campaignID: string,
  campaignName: string,
  notes: string
  alternativeID: string,
}

interface RowProps {
  campaign: LpCampaign;
}

const Row = ({ campaign }: RowProps) => {
  const [open, setOpen] = useState(false);
  // const isSelected = (id: number) => selected.indexOf(id) !== -1;
  // const isItemSelected = isSelected(row.id);
  return (
    <>
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
    </>
  );
}

const CampaignCard = ({ campaign }: RowProps) => {

  const [checked, setChecked] = useState(true);
  const [campaignInfo, setCampaignInfo] = useState(null as CampaignInfo | null);
  const [price, setPrice] = useState(0.00);
  const [showPrice, setShowPrice] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const getCampaignInfo = async (campaignId: number) => {
    console.log('Opening campaign:', campaignId);
    try {
      const campaignInfo = await fetchCampaignInfo(campaignId);
      console.log(campaignInfo);
      setCampaignInfo(campaignInfo);
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    getCampaignInfo(campaign.campaignID);
  }, [campaign.campaignID]);

  //getCampaignInfo(campaign.campaignID);

  const getPrice = async (campaignID: number) => {
    try {
      const contractFieldRevenueRules = await fetchContractFieldRevenueRules();
      console.log(contractFieldRevenueRules);
      let price = 0.00;
      if (contractFieldRevenueRules.length > 0) {
        for (let i = 0; i < contractFieldRevenueRules.length; i++) {
          if (contractFieldRevenueRules[i].fieldID === 83 && contractFieldRevenueRules[i].fieldValue === campaignID.toString()) {
            console.log('Price:', contractFieldRevenueRules[i].price);
            price = contractFieldRevenueRules[i].price;
          }
        }
        setPrice(price);
        setShowPrice(true);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
    }
  }
  return (
    <Grid item xs={12}>
      <Card sx={{ mb: '12px', textAlign: 'left' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ width: 64, height: 64, backgroundColor: 'orange' }} aria-label="recipe">
              {campaign.campaignID.toString()}
            </Avatar>
          }
          action={
            <Tooltip title="Display leads from this campaign">
              <FormControlLabel
                sx={{ mr: '4px', mt: '4px' }}
                value="active"
                control={<Switch checked={checked} onChange={handleChange} color="primary" />}
                label=""
                labelPlacement="start"
                name='active'
              />
            </Tooltip>
          }
          title={<Typography sx={{ fontWeight: '600' }} variant='subtitle1'>{campaign.campaignName}</Typography>}
          subheader={campaign.affiliateName}
        />
        <Divider />
        <CardContent>
          <div>
            <Typography>
              {campaignInfo?.notes || 'Info available soon'}
            </Typography>
            {/* <Accordion sx={{ backgroundColor: '#f6f6f6' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography sx={{ fontWeight: '600' }}>More Info</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {campaignInfo?.notes || 'No info available'}
                </Typography>
              </AccordionDetails>
            </Accordion> */}
          </div>
        </CardContent>
        <CardActions disableSpacing>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1, p: '8px' }} >
            <Box>
              <Typography variant="body1" color="text.primary">Avg.bid: <strong>$65.00</strong></Typography>
              <Typography variant="body1" color="text.primary">OfferID: <strong>{campaign.offerID}</strong></Typography>
            </Box>
            {!showPrice ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => { getPrice(campaign.campaignID) }}
              >
                View Price
              </Button>
            ) : (
              <FormControl variant="filled" sx={{ border: '1px solid #ccc', borderRadius: '3px' }}>
                <InputLabel htmlFor={"bid-" + campaign.campaignID.toString()}>Current bid</InputLabel>
                <FilledInput
                  id={"bid-" + campaign.campaignID.toString()}
                  value={price}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Save bid amount"
                        onClick={() => { }}
                        edge="end"
                      >
                        <SaveIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            )}
          </Box>
        </CardActions>
      </Card>
    </Grid>
  );
};

const CampaignList = ({ campaignList }: CampaignListProps) => {
  return (
    <Grid container spacing={2}>
      {campaignList.map((campaign) => (
        <CampaignCard key={campaign.campaignID} campaign={campaign} />
      ))}
    </Grid>
  );
}

export default CampaignList