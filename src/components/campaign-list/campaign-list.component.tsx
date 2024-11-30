import { Box, Grid } from '@mui/material';
import CampaignCard from '../campaign-card/campaign-card.component';
import { Rule } from '../../routes/dashboard/dashboard.component';
import { useEffect, useState } from 'react';

export interface LpCampaign {
  campaignID: number;
  campaignName: string;
  status: string;
  payout: string;
  affiliateName: string;
  affiliateID: string;
  offerID: string;
  offerName: string;
  verticalName: string;
}

interface CampaignListProps {
  campaignType: string;
  campaignList: LpCampaign[];
  contractId: number;
  scheduledPrice: string;
  rules: Rule[];
  verticalId: string;
}


const CampaignList: React.FC<CampaignListProps> = ({ campaignType, campaignList, contractId, scheduledPrice, rules, verticalId }) => {

  const [ruleMap, setRuleMap] = useState<{ [key: string]: Rule }>({});

  useEffect(() => {
    const createRuleMap = () => {
      const map = rules.reduce<{ [key: string]: Rule }>((acc, rule) => {
        const key = `${rule.affiliateID}-${rule.campaignID}`;
        acc[key] = rule;
        return acc;
      }, {});
      setRuleMap(map);
    };

    createRuleMap();
  }, [rules]);


  return (
    <Box sx={{ flexGrow: 1, width: '100%', padding: 2, boxSizing: 'border-box' }}>
      <Grid container sx={{padding: 2, justifyContent: 'center'}} spacing={2}>
        {campaignList.map((campaign) => {
          const ruleKey = `${campaign.affiliateID}-${campaign.campaignID}`;
          const matchedRule = ruleMap[ruleKey];

          return (
            <CampaignCard
              key={campaign.campaignID}
              campaignType={campaignType}
              campaign={campaign}
              contractId={contractId}
              scheduledPrice={scheduledPrice}
              rule={matchedRule}
              verticalId={verticalId}
            />
          );
        })}
      </Grid>
    </Box>
  );
}

export default CampaignList;