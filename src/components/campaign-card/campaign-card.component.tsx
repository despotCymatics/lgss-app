import { useEffect, useState } from 'react';
import { createContractFieldRevenueRules, fetchCampaignInfo, fetchContractFieldRevenueRules, updateContractFieldRevenueRules } from '../../utils/leadspedia/api';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Avatar, Card, CardActions, CardContent, CardHeader, Divider, FilledInput, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, Switch, Tooltip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LpCampaign } from '../campaign-list/campaign-list.component';

interface CampaignInfo {
  campaignID: string,
  campaignName: string,
  notes: string
  alternativeID: string,
}

interface CampaignProps {
  campaign: LpCampaign;
  contractId: number;
  scheduledPrice: string;
}

const CampaignCard = ({ campaign, contractId, scheduledPrice }: CampaignProps) => {
  const [checked, setChecked] = useState(true);
  const [campaignInfo, setCampaignInfo] = useState(null as CampaignInfo | null);
  const [price, setPrice] = useState("");
  const [priceSaved, setPriceSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldRevenueRuleID, setFieldRevenueRuleID] = useState(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const fieldID = 83;

  const getCampaignData = async () => {
    try {
      const contractFieldRevenueRules = await fetchContractFieldRevenueRules(contractId);
      let price = scheduledPrice;

      const rule = contractFieldRevenueRules.find((rule: any) =>
        rule.fieldID === 83 && rule.fieldValue === campaign.campaignID.toString()
      );

      if (rule) {
        price = rule.price;
        setFieldRevenueRuleID(rule.fieldRevenueRuleID)
      }

      setPrice(price);

      const campaignInfo = await fetchCampaignInfo(campaign.campaignID);
      setCampaignInfo(campaignInfo);
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
    }
  };

  const handleSubmitBid = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      // Call the API function with form data
      if (fieldRevenueRuleID) {
        // Update the existing contract field revenue rule
        const updateResponse = await updateContractFieldRevenueRules(
          fieldRevenueRuleID,
          fieldID,
          campaign.campaignID.toString(),
          parseFloat(price)
        );
        if (updateResponse && updateResponse.success) {
          //setFieldRevenueRuleID(updateResponse)
        }
      } else {
        const createResponse = await createContractFieldRevenueRules(
          contractId,
          fieldID,
          campaign.campaignID.toString(),
          parseFloat(price)
        );
        if (createResponse && createResponse?.success) {
          setFieldRevenueRuleID(createResponse.data.fieldRevenueRuleID)
        }
      }

      // successful price submission
      console.log('Form submitted successfully');
      setPriceSaved(true);
      setTimeout(() => {
        setPriceSaved(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting form:', error.message);
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    getCampaignData();
  }, []);

  return (
    <Grid item xs={6}>
      <Card sx={{ textAlign: 'left' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ width: 64, height: 64, backgroundColor: 'orange' }} aria-label="recipe">
              {campaign.affiliateID.toString()}
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
          subheader={""}
        />
        <Divider />
        <CardContent sx={{ overflow: 'hidden', height: '64px' }}>
          <div>
            <Typography variant="body2" >
              {campaignInfo?.notes || 'Info available soon'}
            </Typography>
          </div>
        </CardContent>
        <CardActions disableSpacing>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexGrow: 1, p: '8px' }} >
            <Box>
              <Typography variant="body1" color="text.primary">Avg.bid: <strong>{campaignInfo?.alternativeID}</strong></Typography>
            </Box>
            {contractId !== 0 ? (
              <FormControl variant="filled" sx={{ border: '1px solid #ccc', borderRadius: '3px', width: '148px' }}>
                <InputLabel htmlFor={"bid-" + campaign.campaignID.toString()}>Current bid</InputLabel>
                <FilledInput
                  id={"bid-" + campaign.campaignID.toString()}
                  value={price}
                  type="number"
                  sx={{ fontWeight: '600' }}
                  onChange={(e) => setPrice(e.target.value)}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  endAdornment={
                    <InputAdornment position="end">
                      { priceSaved ? (
                      <IconButton
                        aria-label="Saved"
                        edge="end"
                        color="success"
                        title='Saved'
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      ) : ( 
                      <IconButton
                        aria-label="Save bid amount"
                        edge="end"
                        onClick={handleSubmitBid}
                        color="primary"
                        title='Save bid amount'
                        disabled={isSubmitting}
                      >
                        <SaveIcon />
                      </IconButton> 
                      )
                    }
                    </InputAdornment>
                  }
                />
              </FormControl>
            ) : null
            }
          </Box>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default CampaignCard;