import { useContext, useEffect, useMemo, useState } from 'react';
import { createContractCallFieldRevenueRules, createContractLeadFieldRevenueRules, createRoutingRule, deleteRoutingRule, fetchCampaignInfo, fetchContractCallFieldRevenueRules, fetchContractLeadFieldRevenueRules, updateContractCallFieldRevenueRules, updateContractLeadFieldRevenueRules } from '../../utils/leadspedia/api';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Divider, FilledInput, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, Switch, TextField, Tooltip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LpCampaign } from '../campaign-list/campaign-list.component';
import { UserContext } from '../../contexts/user.context';
import { Rule } from '../../routes/dashboard/dashboard.component';
import { sendEmail } from '../../utils/emailjs/emailjs.utils';
import './campaign-card.component.scss';
import { affiliateLinks } from '../../data/lpdata';
import badgeImage from '../../assets/img/badge.png';

interface CampaignInfo {
  campaignID: string,
  campaignName: string,
  notes: string
  alternativeID: string,
  affiliateID: string,
}

interface CampaignProps {
  campaignType: string;
  campaign: LpCampaign;
  contractId: number;
  scheduledPrice: string;
  rule?: Rule;
  verticalId: string;
}

const CampaignCard = ({ campaignType, campaign, contractId, scheduledPrice, rule, verticalId }: CampaignProps) => {

  //console.log('Rule:', rule);
  console.log('Campaign:', campaign);
  const isApplicationBasedCampaign = campaign.offerName.includes('Specialty');

  const { currentUser } = useContext(UserContext);

  const [checked, setChecked] = useState(true);
  const [campaignInfo, setCampaignInfo] = useState(null as CampaignInfo | null);
  const [price, setPrice] = useState("");
  const [lastPrice, setLastPrice] = useState("");
  const [priceSaved, setPriceSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldRevenueRuleID, setFieldRevenueRuleID] = useState<number | null>(null);
  const [fieldRevenueFieldID, setFieldRevenueFieldID] = useState<number | null>(null);
  const [switchDisabled, setSwitchDisabled] = useState(false);
  const [affiliateVerified, setAffiliateVerified] = useState(false);


  const leadsVerticalIdTofieldID: { [key: string]: number }[] = [
    { "1": 84 },
    { "2": 85 },
    { "3": 87 },
    { "5": 83 },
    { "6": 131 },
    { "14": 83 },
    { "22": 799 },
    { "12": 800 },
  ]

  const callsVerticalIdToFieldID: { [key: string]: number }[] = [
    { "1": 232 },
    { "2": 235 },
    { "3": 231 },
    { "5": 222 },
    { "6": 234 },
    { "14": 224 },
    { "22": 227 },
    { "12": 229 },
  ]

  const getLeadFieldIdFromVerticalId = (verticalID: string): number | null => {
    const foundData = leadsVerticalIdTofieldID.find(item => verticalID in item)?.[verticalID];
    return foundData ? foundData : null;
  };

  const getCallFieldIdFromVerticalId = (verticalID: string): number | null => {
    const foundData = callsVerticalIdToFieldID.find(item => verticalID in item)?.[verticalID];
    return foundData ? foundData : null;
  }


  const getCampaignData = async () => {
    const fieldID = campaignType === 'leads' ? getLeadFieldIdFromVerticalId(verticalId) : getCallFieldIdFromVerticalId(verticalId);

    if (!fieldID) {
      console.error('Field ID not found for vertical ID:', verticalId);
      return;
    }
    setFieldRevenueFieldID(fieldID);

    try {
      const contractFieldRevenueRules = campaignType === 'leads' ?
        await fetchContractLeadFieldRevenueRules(contractId) :
        await fetchContractCallFieldRevenueRules(contractId);

      let price = scheduledPrice;

      const contractFieldRevenueRule = contractFieldRevenueRules.find((r: any) =>
        r.fieldID === fieldID && r.fieldValue === campaign.campaignID.toString()
      );

      if (contractFieldRevenueRule) {
        price = campaignType === 'leads' ? contractFieldRevenueRule.price : contractFieldRevenueRule.revenue;
        const fieldRevenueRuleID = campaignType === 'leads' ? contractFieldRevenueRule.fieldRevenueRuleID : contractFieldRevenueRule.callFieldRevenueID;
        setFieldRevenueRuleID(fieldRevenueRuleID)
      }

      setPrice(price);
      setLastPrice(price);

      const campaignInfo = await fetchCampaignInfo(campaign.campaignID);
      if (campaignInfo && campaignInfo.notes.includes('**')) {
        campaignInfo.notes = campaignInfo.notes.replace('**', '');
        setAffiliateVerified(true);
      }
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
      if (fieldRevenueRuleID && fieldRevenueFieldID) {
        // Update the existing contract field revenue rule
        const updateResponse = campaignType === 'leads' ?
          await updateContractLeadFieldRevenueRules(
            fieldRevenueRuleID,
            fieldRevenueFieldID,
            campaign.campaignID.toString(),
            parseFloat(price)
          ) :
          await updateContractCallFieldRevenueRules(
            fieldRevenueRuleID,
            fieldRevenueFieldID,
            campaign.campaignID.toString(),
            parseFloat(price)
          );

        if (updateResponse && updateResponse.success) {
          bidSubmitted();
        }
      } else {
        // Create a new contract field revenue rule
        if (fieldRevenueFieldID) {
          const createResponse = campaignType === 'leads' ?
            await createContractLeadFieldRevenueRules(
              contractId,
              fieldRevenueFieldID,
              campaign.campaignID.toString(),
              parseFloat(price)
            ) :
            await createContractCallFieldRevenueRules(
              contractId,
              fieldRevenueFieldID,
              campaign.campaignID.toString(),
              parseFloat(price)
            );

          if (createResponse && createResponse?.success) {
            setFieldRevenueRuleID(createResponse.data.fieldRevenueRuleID)
            bidSubmitted();
          }
        }
      }

    } catch (error: any) {
      console.error('Error submitting form:', error.message);
    }
  };

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const campaignToggle = event.target.checked;
    setChecked(campaignToggle);
    setSwitchDisabled(true);

    if (!campaignToggle && currentUser && currentUser !== null) {
      createRoutingRule(currentUser.advertiserId, campaign.campaignID, contractId, campaign.affiliateID)
        .then((response) => {
          console.log('Routing rule created:', response);
          setSwitchDisabled(false);
          sendToggleEmail();
        })
        .catch((error: any) => {
          console.error('Error creating routing rule:', error.message);
        });
    } else if (campaignToggle && currentUser && currentUser !== null && rule && rule.leadRoutingID !== 0) {
      deleteRoutingRule(rule?.leadRoutingID)
        .then((response) => {
          if (response && response.success) {
            console.log('Routing rule deleted:', response);
            setSwitchDisabled(false);
            sendToggleEmail();
          }
        })
        .catch((error: any) => {
          console.error('Error creating routing rule:', error.message);
        });
    }
  };

  useMemo(() => {
    getCampaignData();
  }, []);

  useEffect(() => {
    if (rule) {
      //console.log('Rule:', rule);
      if (rule.rule === 'Block') {
        setChecked(false);
      }
    }
  }, [rule]);

  function bidSubmitted() {
    // successful price submission
    console.log('Form submitted successfully');
    setPriceSaved(true);
    sendBidChangeEmail();
    setTimeout(() => {
      setPriceSaved(false);
      setLastPrice(price); // update last price
    }, 3000);
    setIsSubmitting(false);
  }

  function sendToggleEmail() {
    const campaignStatus = checked ? 'active' : 'paused'
    if (currentUser && currentUser !== null) {
      sendEmail('Advertiser ' + currentUser.displayName + ', ID: ' + currentUser.advertiserId + ' - has ' + campaignStatus + ' campaign: ' + campaign.campaignName + ' campaignID: ' + campaign.campaignID);
    }
  }

  function sendBidChangeEmail() {
    if (currentUser && currentUser !== null) {
      sendEmail('Advertiser ' + currentUser.displayName + ', ID: ' + currentUser.advertiserId + ' has changed bid for campaign: ' + campaign.campaignName + ' campaignID: ' + campaign.campaignID + ' - from $' + lastPrice + ' to $' + price);
    }
  }

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card className={`campaignCard ${!checked ? 'inactive' : ''}`}>
        <CardHeader
          className='cardHeader'
          avatar={
            <Avatar className='campaignLogo'>
              AF<br />00{campaign.affiliateID.toString()}
            </Avatar>
          }
          action={
            isApplicationBasedCampaign ? null :
              <Tooltip title="Toggle leads for this campaign">
                <FormControlLabel
                  sx={{ mr: '4px', mt: '4px' }}
                  value={checked}
                  control={<Switch disabled={switchDisabled} checked={checked} onChange={handleToggle} color="primary" />}
                  label=""
                  labelPlacement="start"
                  name='active'
                />
              </Tooltip>
          }
          title={
            <Typography sx={{ fontWeight: '600' }} variant='subtitle1'>
              Affiliate {campaign.affiliateID.toString()}
            </Typography>
          }
          subheader={
            <div className='cardSubheader'>
              <span>{campaign.offerName}</span>
              {affiliateVerified &&
                <Tooltip title="Verified affiliate">
                  <img className='badge' src={badgeImage} alt="badge" />
                </Tooltip>
              }
            </div>
          }
        />
        <Divider />
        <CardContent className='cardContent'>
          <div>
            {/* <Typography sx={{ fontWeight: '600' }} variant='subtitle1'>{campaign.campaignName}</Typography> */}
            <Typography sx={{ fontSize: '0.8rem' }}>
              {campaignInfo?.notes || 'Info available soon'}
            </Typography>
          </div>
        </CardContent>


        <CardActions disableSpacing>
          {isApplicationBasedCampaign ? (
            <Box sx={{ p: '8px', width: '100%' }} >
              <Button
                variant="contained"
                size="medium"
                href={affiliateLinks[campaign.affiliateID.toString()]}
                color="primary"
                title='Apply for this campaign'
                target="_blank"
                sx={{ width: '100%' }}
              >
                Apply Now
              </Button>
            </Box>
          ) : (
            <Box sx={{ p: '8px', width: '100%' }} >
              {contractId !== 0 ? (
                <FormControl variant="standard" className='bidInput'>
                  {/* <InputLabel htmlFor={"bid-" + campaign.campaignID.toString()}>Current bid</InputLabel> */}
                  <TextField
                    id={"bid-" + campaign.campaignID.toString()}
                    value={price}
                    type="number"
                    variant="standard"
                    sx={{ fontWeight: '600', pb: '16px' }}
                    onChange={(e) => setPrice(e.target.value)}
                    label="My Current Bid"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      endAdornment:
                        <InputAdornment position="end">
                          {priceSaved ? (
                            <IconButton
                              aria-label="Saved"
                              edge="end"
                              color="success"
                              title='Saved'
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          ) : (
                            <Button
                              variant="contained" endIcon={<SaveIcon />}
                              size="small"
                              onClick={handleSubmitBid}
                              color="primary"
                              title='Save bid amount'
                              disabled={isSubmitting}
                            >
                              Save
                            </Button>
                          )
                          }
                        </InputAdornment>
                    }}
                  />
                </FormControl>
              ) : null
              }
              <Box>
                <Typography variant="body2" color="text.primary">Avg.bid: <strong>{campaignInfo?.alternativeID}</strong></Typography>
              </Box>
            </Box>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
};

export default CampaignCard;