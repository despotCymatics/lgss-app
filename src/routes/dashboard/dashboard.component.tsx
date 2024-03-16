import { useContext, useEffect, useState } from 'react';
//import AffiliateList, { LpAffiliate } from '../../components/dashboard-list/affiliate-list.component';
import { fetchCampaigns, fetchOffers, getData, GetRequest, fetchContracts } from '../../utils/leadspedia/api';
import { InputLabel, MenuItem, Select, Link, Box, Toolbar, Container, Typography, FormControl, SelectChangeEvent, CircularProgress, Grid, Avatar, Divider, styled } from '@mui/material';
import CampaignList from '../../components/campaign-list/campaign-list.component';
import { UserContext } from '../../contexts/user.context';
import RoofingIcon from '@mui/icons-material/Roofing';
import SensorWindowIcon from '@mui/icons-material/SensorWindow';
import HouseSidingIcon from '@mui/icons-material/HouseSiding';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import LockIcon from '@mui/icons-material/Lock';
import MedicationIcon from '@mui/icons-material/Medication';
import PestControlIcon from '@mui/icons-material/PestControl';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BathtubIcon from '@mui/icons-material/Bathtub';
import CountertopsIcon from '@mui/icons-material/Countertops';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

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
  //const [lpAffiliates, setLpAffiliates] = useState<any[] | null>([]);
  const [lpCampaigns, setLpCampaigns] = useState<any[] | null>([]);
  const [lpVerticals, setLpVerticals] = useState<any[] | null>([]);
  const [lpOffers, setLpOffers] = useState<any[] | null>([]);
  const [contracts, setContracts] = useState<any[] | null>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [verticalID, setVerticalID] = useState<string>('')

  const { currentUser } = useContext(UserContext)

  useEffect(() => {
    //console.log(currentUser);
    if (currentUser) {
      fetchVerticals();
    }
  }, [currentUser])


  useEffect(() => {
    if (verticalID !== '' && currentUser) {
      fetchAndSetCampaigns(verticalID);
      fetchAndSetContracts(verticalID, currentUser.advertiserId);
      //fetchAndSetOffers(verticalID);
    }
  }, [verticalID, currentUser]);



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

  const fetchAndSetCampaigns = async (value: string) => {
    const campaigns = await fetchCampaigns(value);
    setLpCampaigns(campaigns);
    setIsLoading(false);
  };

  const fetchAndSetContracts = async (verticalID: string, advertiserId: string) => {
    const contracts = await fetchContracts(verticalID, advertiserId);
    setContracts(contracts);
    setIsLoading(false);
  };

  const fetchAndSetOffers = async (value: string) => {
    const offers = await fetchOffers(value);
    setLpOffers(offers);
    setIsLoading(false);
  };

  const handleChangeVertical = (event: SelectChangeEvent<string>) => {
    setIsLoading(true);
    const {
      target: { value },
    } = event;
    setVerticalID(value);
  }

  const handleClickVertical = (verticalID: number) => {
    setIsLoading(true);
    setVerticalID(verticalID.toString());
  }

  const ServiceIcon = styled('div')({
    cursor: 'pointer',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 0 1rem 0',
  });


  type VerticalVisualData = {
    icon: JSX.Element;
    color: string;
  };

  const verticalVisualData: { [key: string]: VerticalVisualData }[] = [
    { '1': { icon: <RoofingIcon sx={{ fontSize: 40 }} />, color: '#f44336' } },
    { '2': { icon: <SensorWindowIcon sx={{ fontSize: 40 }} />, color: '#e91e63' } },
    { '3': { icon: <HouseSidingIcon sx={{ fontSize: 40 }} />, color: '#9c27b0' } },
    { '4': { icon: <SolarPowerIcon sx={{ fontSize: 40 }} />, color: '#009688' } },
    { '6': { icon: <BathtubIcon sx={{ fontSize: 40 }} />, color: '#00bcd4' } },
    { '7': { icon: <LockIcon sx={{ fontSize: 40 }} />, color: '#9c27b0' } },
    { '8': { icon: <MedicationIcon sx={{ fontSize: 40 }} />, color: '#b2102f' } },
    { '9': { icon: <PestControlIcon sx={{ fontSize: 40 }} />, color: '#673ab7' } },
    { '10': { icon: <HealthAndSafetyIcon sx={{ fontSize: 40 }} />, color: '#009688' } },
    { '11': { icon: <DashboardIcon sx={{ fontSize: 40 }} />, color: '#ffc107' } },
    { '12': { icon: <CountertopsIcon sx={{ fontSize: 40 }} />, color: '#795548' } },
    { '13': { icon: <AssignmentTurnedInIcon sx={{ fontSize: 40 }} />, color: '#01579b' } },
  ];

  const getVerticalData = (verticalID: string): VerticalVisualData => {
    const defaultData: VerticalVisualData = { icon: <RoofingIcon sx={{ fontSize: 40 }} />, color: 'primary' };
    const foundData = verticalVisualData.find(item => verticalID in item)?.[verticalID];
    return foundData ? foundData : defaultData;
  };


  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: `calc(100vh - 70px)`,
        overflow: 'auto',
      }}
    >
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {currentUser ? (
          <div>
            {isLoading ? (
              <CircularProgress />
            ) : (lpVerticals && lpVerticals?.length > 0) ? (
              <div>
                <Typography variant="h4" component="h2" align='center' margin={'0 30px 60px'}>Lead Verticals</Typography>
                <Grid container spacing={2}>
                  {lpVerticals
                    .filter((ver: any) => [1, 2, 3, 4, 6, 8, 9, 10, 11, 12, 13, 14].includes(ver.verticalID))
                    .map((ver: any) => (
                      <Grid item md={2} xs={6} key={ver.verticalID}>
                        <ServiceIcon
                          className="serviceButton"
                          onClick={() => {
                            handleClickVertical(ver.verticalID);
                          }}
                        >
                          <Avatar sx={{ bgcolor: getVerticalData(ver.verticalID).color, width: 60, height: 60 }}>
                            {getVerticalData(ver.verticalID).icon}
                          </Avatar>
                          <Typography align='left' margin={'10px 0'} fontSize={'12px'} textAlign={'center'} fontWeight={'600'}>
                            {ver.verticalID + "  " + ver.verticalName}
                          </Typography>
                        </ServiceIcon>
                      </Grid>
                    ))}
                </Grid>
                <FormControl fullWidth >
                  <InputLabel id="select-vertical-label">Select Vertical</InputLabel>
                  <Select
                    labelId='select-vertical-label'
                    name='vertical'
                    id='verticalSelect'
                    value={verticalID}
                    onChange={handleChangeVertical}
                    label="Select Vertical"
                    placeholder="Select Vertical"
                    sx={{ background: '#fff', fontWeight: 'bold', textAlign: 'left' }}
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
            {(lpCampaigns && lpCampaigns.length > 0 && !isLoading) ? (
              <div>
                <Divider sx={{ margin: '40px 10px 30px' }}>Campaigns for Vertical ID: {verticalID}</Divider>
                {/* <Typography variant="h4" component="h2" align='left' margin={'30px 0'}>Campaigns for Vertical ID: {verticalID}</Typography> */}
                <CampaignList campaignList={lpCampaigns} />
              </div>
            ) : (lpCampaigns && lpCampaigns.length > 0 && !isLoading) ? (
              <p>No Campaigns available</p>
            ) : null}

            {(lpOffers && lpOffers.length > 0 && !isLoading) ? (
              <div>
                {/* <Typography variant="h4" component="h2" align='left' margin={'30px 0'}>Offers for Vertical ID: {verticalID}</Typography>
                <div>
                  {lpOffers.map((offer: any) => (
                    <Typography sx={{ background: '#fff', fontWeight: 'bold', textAlign: 'left' }} key={offer.offerID}>
                      <p>ID: {offer.offerID}</p>
                      <p>Name: {offer.offerName}</p>
                      <p>{JSON.stringify(offer)}</p>
                    </Typography>
                  ))}
                </div> */}
              </div>
            ) : (lpOffers && lpOffers.length < 0 && !isLoading) ? (
              <p>No Offers available</p>
            ) : null}
          </div>
        ) : currentUser == null && !isLoading ? (
          <div>You must login to view this page</div>
        ) : null}
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </Box>
  );
}

export default Dashboard
