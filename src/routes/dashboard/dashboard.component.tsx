import { useEffect, useState } from 'react';
import AffiliateList, { LpAffiliate } from '../../components/dashboard-list/affiliate-list.component';
import { getData, GetRequest } from '../../utils/leadspedia/api';
import { InputLabel, MenuItem, Select, Link, Box, Toolbar, Container, Typography, FormControl, SelectChangeEvent } from '@mui/material';
import CampaignList from '../../components/campaign-list/campaign-list.component';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        LGSS
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Dashboard = () => {
  const [lpAffiliates, setLpAffiliates] = useState<any[] | null>([]);
  const [lpCampaigns, setLpCampaigns] = useState<any[] | null>([]);
  const [lpVerticals, setLpVerticals] = useState<any[] | null>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [vertical, setVertical] = useState<string>('')

  useEffect(() => {

    //fetchAffiliates();
    fetchVerticals();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  // move these to separate file
  const fetchAffiliates = async () => {
    try {
      const result = await getData<GetRequest>({
        path: 'affiliates/getAll.do'
      });

      if (result.success && result.response.data.length > 0) {
        setLpAffiliates(result.response.data);
        console.log(result)
      }
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVerticals = async () => {
    try {
      const result = await getData<GetRequest>({
        path: 'verticals/getAll.do'
      });

      if (result.success && result.response.data.length > 0) {
        setLpVerticals(result.response.data);
        console.log(result)
      }
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const result = await getData<GetRequest>({
        path: 'campaigns/getAll.do',
        payload: {
          verticalID: vertical,
          limit: 1000,
        }
      });

      if (result.success) {
        setLpCampaigns(result.response.data);
        console.log(result)
      }
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeVertical = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    setVertical(value);
    fetchCampaigns();
  }

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (lpVerticals && lpVerticals?.length > 0) ? (
            <div>
              <h2>Lead Vertical</h2>
              <FormControl fullWidth sx={{ m: 1 }} >
                <InputLabel id="select-vertical-label">Select Vertical</InputLabel>
                <Select
                  labelId='select-vertical-label'
                  name='vertical'
                  id='verticalSelect'
                  value={vertical}
                  onChange={handleChangeVertical}
                  label="Select Vertical"
                  placeholder="Select Vertical"
                  sx={{ width: '60%', background: '#fff', }}
                >
                  {lpVerticals.map((ver: any) => (
                    <MenuItem
                      key={ver.verticalID}
                      value={ver.verticalID}
                    >
                      {ver.verticalName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          ) : (
            <p>No data available</p>
          )}
          {
            lpCampaigns && lpCampaigns.length > 0 ? (
              <div>
                <h2>Campaigns for Verttical ID: {vertical}</h2>
                <CampaignList campaignList={lpCampaigns} />
              </div>
            ) : (
              <p>No Campaigns available</p>
            )
          }
        </div>
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </Box>
  );
}

export default Dashboard
