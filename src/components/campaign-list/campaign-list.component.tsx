import { useEffect, useState } from 'react';
import { fetchSchedule } from '../../utils/leadspedia/api';
import { Grid } from '@mui/material';
import CampaignCard from '../campaign-card/campaign-card.component';

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
  contractId: number;
  scheduledPrice: string;
}

const CampaignList = ({ campaignList, contractId, scheduledPrice }: CampaignListProps) => {

  // const [scheduledPrice, setScheduledPrice] = useState<string>('');

  // const getScheduledPrice = async () => {
  //   if (contractId === 0) return;
  //   try {
  //     const schedule = await fetchSchedule(contractId);
  //     console.log(schedule);
  //     console.log('Schedule data:', schedule); // Log the schedule data
  //     setScheduledPrice(schedule[0].price);
  //   } catch (error: any) {
  //     console.error('Error fetching data:', error.message);
  //   }
  // }

  // useEffect(() => {
  //   getScheduledPrice();
  // }, [campaignList]); 

  console.log('Scheduled price:', scheduledPrice); // Log the scheduledPrice state

  return (
    <Grid container spacing={2}>
      {campaignList.map((campaign) => (
        <CampaignCard
          key={campaign.campaignID}
          campaign={campaign}
          contractId={contractId}
          scheduledPrice={scheduledPrice}
        />
      ))}
    </Grid>
  );
}

export default CampaignList