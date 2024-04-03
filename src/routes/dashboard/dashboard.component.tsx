import { useContext, useEffect, useState } from 'react';
//import AffiliateList, { LpAffiliate } from '../../components/dashboard-list/affiliate-list.component';
import { fetchCampaigns, fetchContracts, fetchVerticals, fetchSchedule } from '../../utils/leadspedia/api';
import { InputLabel, MenuItem, Select, Link, Box, Toolbar, Container, Typography, FormControl, SelectChangeEvent, CircularProgress, Grid, Avatar, Divider, styled, Alert, Stack, Button } from '@mui/material';
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
import BathroomIcon from '@mui/icons-material/Bathroom';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import WaterDamageIcon from '@mui/icons-material/WaterDamage';
import PersonIcon from '@mui/icons-material/Person';

interface Contract {
  contractID: number;
  contractName: string;
  verticalID: string;
  revenueModel: string;
}

const Dashboard = () => {

  const { currentUser } = useContext(UserContext)

  const [lpVerticals, setLpVerticals] = useState<any[] | null>([]);
  const [lpCampaigns, setLpCampaigns] = useState<any[] | null>(null);
  const [lpContracts, setLpContracts] = useState<any[] | null>([]);

  const [campaignContractId, setCampaignContractId] = useState<number>(0);
  const [scheduledPrice, setScheduledPrice] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState<boolean>(false);

  const [verticalID, setVerticalID] = useState<string>('')
  const [verticalOffers, setVerticalOffers] = useState<VerticalOffer[]>([]);
  const [offerID, setOfferID] = useState<string>('')


  useEffect(() => {
    //setIsLoading(true);
    if (currentUser && currentUser.advertiserId) {
      fetchAndSetVerticals();
    }
  }, [currentUser])

  const fetchAndSetVerticals = async () => {
    setIsLoading(true);
    await fetchVerticals()
      .then((verticals: any) => {
        setLpVerticals(verticals);
        setIsLoading(false);
      })
  };

  const fetchAndSetCampaigns = async (verticalID: string, offerID: string, contractID: number, start?: number) => {
    const campaigns = await fetchCampaigns(verticalID, offerID, start);

    fetchAndSetScheduledPrice(contractID)
      .then((schedule: any) => {
        setIsLoading(false);
      })

    if (start === 0) {
      setLpCampaigns(campaigns);
      setIsLoadingCampaigns(false);
      return;
    }
    setLpCampaigns((prevCampaigns) => prevCampaigns ? [...prevCampaigns, ...campaigns] : campaigns); // Append the fetched campaigns to the existing list
    setIsLoadingCampaigns(false);
  };

  const fetchAndSetScheduledPrice = async (campaignContractId: number) => {
    if (campaignContractId === 0) return;
    try {
      const schedule = await fetchSchedule(campaignContractId);
      console.log(schedule);
      console.log('Schedule data:', schedule); // Log the schedule data
      setScheduledPrice(schedule[0].price);
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
    }
  }

  const loadMoreCampaigns = () => {
    setIsLoadingCampaigns(true);
    const start = lpCampaigns ? lpCampaigns.length : 0;
    //setStart(start + 4); // Increment the start index to fetch the next set of campaigns
    fetchAndSetCampaigns(verticalID, offerID, campaignContractId, start); // Pass the updated start index
  };

  const fetchContractsAndCampaings = async (verticalID: string, offerID: string, start: number) => {
    if (verticalID !== '' && currentUser) {
      fetchContracts(verticalID, currentUser.advertiserId)
        .then((contracts: Contract[]) => {
          if (contracts && contracts.length > 0) {
            setLpContracts(contracts);
            const contractName = "Shared Bathroom Leads"; // First select field value
            const contractID = getContractID(contracts, contractName);
            fetchAndSetCampaigns(verticalID, offerID, contractID, start)
            setCampaignContractId(contractID);
          } else {
            //NO CONTRACTS
            setCampaignContractId(0);
            setLpCampaigns([]);
            setLpContracts([]);
            setScheduledPrice('');
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error.message);
          setIsLoading(false);
        });
    }
  }

  // const handleChangeVertical = (event: SelectChangeEvent<string>) => {
  //   setIsLoading(true);
  //   const { target: { value } } = event;
  //   fetchContractsAndCampaings(value, 0);
  //   setVerticalID(value);
  // }

  const handleClickVertical = (id: number) => {
    setIsLoading(true);
    if (id.toString() === verticalID) {
      setIsLoading(false);
      return;
    }
    const verticalOffers = getVerticalOffers(id.toString());
    if (!verticalOffers) {
      setIsLoading(false);
      return;
    }
    setVerticalOffers(verticalOffers);
    setVerticalID(id.toString());
    setOfferID(verticalOffers[0].id);
    fetchContractsAndCampaings(id.toString(), verticalOffers[0].id, 0);
  }

  // const handleChangeContract = (event: SelectChangeEvent<string>) => {
  //   const { target: { value } } = event;
  //   setCampaignContractId(Number(value));
  //   fetchAndSetCampaigns(verticalID, 0)
  // }

  const handleOfferChange = (event: SelectChangeEvent<string>) => {
    const { target: { value } } = event;
    const offerID = value;
    setOfferID(offerID);
    const selectedOffer = verticalOffers.find((offer) => offer.id === offerID)

    if (!selectedOffer || !lpContracts || lpContracts.length === 0) return;

    const contractID = getContractID(lpContracts, selectedOffer?.name || '');
    fetchAndSetCampaigns(verticalID, offerID, contractID, 0);
  }

  const getContractID = (contracts: Contract[], contractName: string): number => {
    const foundContract = contracts.find(contract => contract.contractName === contractName);
    return foundContract ? foundContract.contractID : contracts[0].contractID;
  };

  const ServiceIcon = styled('div')({
    cursor: 'pointer',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 0 1rem 0',
    '& .MuiAvatar-root': {
      transition: 'all 0.3s',
      border: '6px solid transparent',
    },
    ':hover': {
      '& .MuiAvatar-root': {
        border: '6px solid rgba(0, 0, 0, 0.3)',
      },
      '& .MuiTypography-root': {
        textDecoration: 'underline',
      },
    },
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
    { '5': { icon: <BathroomIcon sx={{ fontSize: 40 }} />, color: '#2196f3' } },
    { '6': { icon: <BathtubIcon sx={{ fontSize: 40 }} />, color: '#00bcd4' } },
    { '7': { icon: <LockIcon sx={{ fontSize: 40 }} />, color: '#9c27b0' } },
    { '8': { icon: <MedicationIcon sx={{ fontSize: 40 }} />, color: '#b2102f' } },
    { '9': { icon: <PestControlIcon sx={{ fontSize: 40 }} />, color: '#673ab7' } },
    { '10': { icon: <HealthAndSafetyIcon sx={{ fontSize: 40 }} />, color: '#009688' } },
    { '11': { icon: <DashboardIcon sx={{ fontSize: 40 }} />, color: '#ffc107' } },
    { '12': { icon: <CountertopsIcon sx={{ fontSize: 40 }} />, color: '#795548' } },
    { '13': { icon: <AssignmentTurnedInIcon sx={{ fontSize: 40 }} />, color: '#01579b' } },
    { '14': { icon: <MeetingRoomIcon sx={{ fontSize: 40 }} />, color: '#01579b' } },
    { '22': { icon: <WaterDamageIcon sx={{ fontSize: 40 }} />, color: '#009688' } },
  ];

  const getVerticalData = (verticalID: string): VerticalVisualData => {
    const defaultData: VerticalVisualData = { icon: <RoofingIcon sx={{ fontSize: 40 }} />, color: 'primary' };
    const foundData = verticalVisualData.find(item => verticalID in item)?.[verticalID];
    return foundData ? foundData : defaultData;
  };

  type VerticalOffer = {
    name: string;
    id: string;
  }

  const verticalIDToOffer: { [key: string]: VerticalOffer[] }[] = [
    { '1': [{ name: 'Shared Roofing Leads', id: '61' }, { name: 'Exclusive Roofing Leads', id: '68' }] },
    { '2': [{ name: 'Shared Windows Leads', id: '62' }, { name: 'Exclusive Windows Leads', id: '73' }] },
    { '3': [{ name: 'Shared Siding Leads', id: '64' }, { name: 'Exclusive Siding Leads', id: '69' }] },
    { '5': [{ name: 'Shared Bathroom Leads', id: '60' }, { name: 'Exclusive Bathroom Leads', id: '74' }] },
    { '6': [{ name: 'Shared Walk-In Tubs Leads', id: '63' }, { name: 'Exclusive Walk-In Tubs Leads', id: '75' }] },
    { '14': [{ name: 'Shared Doors Leads', id: '65' }, { name: 'Exclusive Doors Leads', id: '70' }] },
    { '22': [{ name: 'Shared Gutters Leads', id: '67' }, { name: 'Exclusive Bathroom Leads', id: '72' }] },
    { '12': [{ name: 'Shared Kitchen Leads', id: '66' }, { name: 'Exclusive Kitchen Leads', id: '71' }] },
  ]

  const getVerticalOffers = (verticalID: string): VerticalOffer[] => {
    const foundData = verticalIDToOffer.find(item => verticalID in item)?.[verticalID];
    return foundData ? foundData : [];
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
          <Stack justifyContent="center" alignItems="center" spacing={3}>
            {isLoading ? (
              <>
                <CircularProgress />
                <Typography variant="h5" component="h4" align='center' margin={'0 30px 60px'}>Please wait</Typography>
              </>
            ) : (lpVerticals && lpVerticals?.length > 0) ? (
              <Box sx={{ marginBottom: '60px' }}>
                <Typography variant="h4" component="h2" align='center' margin={'0 30px 60px'}>Lead Verticals</Typography>
                <Grid container spacing={2}>
                  {lpVerticals
                    .filter((ver: any) => [1, 2, 3, 5, 6, 12, 14, 22].includes(ver.verticalID))
                    .map((ver: any) => (
                      <Grid item md={3} xs={6} key={ver.verticalID}>
                        <ServiceIcon
                          className="serviceButton"
                          onClick={() => {
                            handleClickVertical(ver.verticalID);
                          }}
                        >
                          <Avatar sx={{ bgcolor: getVerticalData(ver.verticalID).color, width: 64, height: 64 }}>
                            {getVerticalData(ver.verticalID).icon}
                          </Avatar>
                          <Typography align='left' margin={'10px 0'} fontSize={'12px'} textAlign={'center'} fontWeight={'600'}>
                            {ver.verticalName}
                          </Typography>
                        </ServiceIcon>
                      </Grid>
                    ))}
                </Grid>

                {verticalID !== '' && verticalOffers.length > 0 ? (
                  <FormControl fullWidth sx={{ margin: '20px 0' }}>
                    <InputLabel id="select-offer-label">Select Offer</InputLabel>
                    <Select
                      labelId='select-offer-label'
                      name='offer'
                      id='offerSelect'
                      value={offerID}
                      onChange={handleOfferChange}
                      label="Select Offer"
                      placeholder="Select Offer"
                      sx={{ background: '#fff', fontWeight: 'bold', textAlign: 'left' }}
                    >
                      {verticalOffers.map((off: VerticalOffer) => (
                        <MenuItem
                          key={off.id}
                          value={off.id}
                        >
                          {off.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : null}


                {/* <FormControl fullWidth sx={{margin: '20px 0'}}>
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
                </FormControl> */}
                {/* {lpContracts && lpContracts.length > 0 && !isLoading ? (
                  <FormControl fullWidth sx={{ margin: '20px 0' }}>
                    <InputLabel id="select-contract-label">Select Contract</InputLabel>
                    <Select
                      labelId='select-contract-label'
                      name='contract'
                      id='contractSelect'
                      value={campaignContractId.toString()}
                      onChange={handleChangeContract}
                      label="Select Contract"
                      placeholder="Select Contract"
                      sx={{ background: '#fff', fontWeight: 'bold', textAlign: 'left' }}
                    >
                      {lpContracts.map((con: any) => (
                        <MenuItem
                          key={con.contractID}
                          value={con.contractID}
                        >
                          {con.contractName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : null} */}

              </Box>
            ) : (
              <p>No data available</p>
            )}
            {(lpCampaigns && lpCampaigns.length > 0 && !isLoading && campaignContractId !== 0 && scheduledPrice !== '') ? (
              <div>
                <Divider sx={{ margin: '40px 10px 30px' }}>Campaigns for Vertical: {verticalID} - <strong>{getVerticalName(verticalID)}</strong></Divider>
                <CampaignList campaignList={lpCampaigns} contractId={campaignContractId} scheduledPrice={scheduledPrice} />
                <Box textAlign="center" mt={4}>
                  {isLoadingCampaigns ? (
                    <CircularProgress />
                  ) : <Button onClick={loadMoreCampaigns} size='large' variant="contained" color="primary">
                    Load More
                  </Button>
                  }

                </Box>
              </div>
            ) : ((lpCampaigns && lpCampaigns.length === 0) && !isLoading && offerID !== '') ? (
              <Alert sx={{ maxWidth: '600px' }} severity="warning">
                Currently you do not have any campaigns set up for this vertical
              </Alert>
            ) : null}
          </Stack>
        ) : currentUser === null && !isLoading ? (
          <Box>
            <Typography sx={{ marginBottom: 3 }}>You must Sign in to view this page</Typography>
            <Button href={'/sign-in'} variant="contained" endIcon={<PersonIcon />}>Sign In</Button>
          </Box>
        ) : null}
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </Box>
  );

  function getVerticalName(verticalID: string) {
    if (!lpVerticals) return '';
    const vertical = lpVerticals.find((ver: any) => ver.verticalID === Number(verticalID));
    return vertical?.verticalName;
  }


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
}



export default Dashboard
