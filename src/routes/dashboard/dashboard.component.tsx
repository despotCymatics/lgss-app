import { Fragment, useContext, useEffect, useState } from 'react';
//import AffiliateList, { LpAffiliate } from '../../components/dashboard-list/affiliate-list.component';
import { fetchCampaigns, fetchContracts, fetchVerticals, fetchSchedule, fetchRules } from '../../utils/leadspedia/api';
import { InputLabel, MenuItem, Select, Link, Box, Toolbar, Container, Typography, FormControl, SelectChangeEvent, CircularProgress, Grid, Avatar, Divider, styled, Alert, Stack, Button, Tabs, Tab } from '@mui/material';
import CampaignList from '../../components/campaign-list/campaign-list.component';
import { UserContext } from '../../contexts/user.context';
import PersonIcon from '@mui/icons-material/Person';
import CallIcon from '@mui/icons-material/Call';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { VerticalOffer, VerticalVisualData, verticalIDToCallOffers, verticalIDToLeadOffers, verticalVisualData } from '../../data/lpdata';
import './dashboard.component.scss';


interface Contract {
  contractID: number;
  contractName: string;
  verticalID: string;
  revenueModel: string;
}

export interface Rule {
  advertiserID: number;
  affiliateID: number;
  campaignID: number;
  contractID: number;
  leadRoutingID: number;
  rule: string;
}

const Dashboard = () => {

  const { currentUser } = useContext(UserContext)

  const [lpType, setLpType] = useState<string>('leads');

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
  const [rules, setRules] = useState<Rule[]>([]);

  const fetchAndSetVerticals = async () => {
    setIsLoading(true);
    await fetchVerticals()
      .then((verticals: any) => {
        setLpVerticals(verticals);
        setIsLoading(false);
      })
  };

  // USE EFFECT
  useEffect(() => {
    if (currentUser && currentUser.advertiserId) {
      fetchAndSetVerticals();
      console.log('currentUser:', currentUser);

    }
  }, [currentUser])


  const fetchAndSetRules = async (advertiserId: string) => {
    await fetchRules(advertiserId)
      .then((rules: Rule[]) => {
        console.log("RULES: ", rules);
        setRules(rules);
      })
  }

  const fetchAndSetCampaigns = async (verticalID: string, offerID: string, contractID: number, start?: number) => {
    const campaigns = await fetchCampaigns(verticalID, offerID, start);

    fetchAndSetScheduledPrice(contractID)
      .then((schedule: any) => {
        if (currentUser && currentUser.advertiserId) {
          fetchAndSetRules(currentUser.advertiserId)
            .then
            (() => {
              setIsLoading(false);
            })
        }
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
      let price = '0';
      const schedule = await fetchSchedule(campaignContractId);
      if (schedule && schedule.length > 0) {
        console.log('Schedule data:', schedule); // Log the schedule data
        price = schedule[0].price;
      }
      setScheduledPrice(price);

    } catch (error: any) {
      console.error('Error fetching data:', error.message);
    }
  }

  const loadMoreCampaigns = () => {
    setIsLoadingCampaigns(true);
    const start = lpCampaigns ? lpCampaigns.length : 0;
    fetchAndSetCampaigns(verticalID, offerID, campaignContractId, start); // Pass the updated start index
  };

  const fetchContractsAndCampaings = async (verticalID: string, verticalOffers: VerticalOffer[], start: number) => {
    if (verticalID !== '' && currentUser) {
      fetchContracts(lpType, verticalID, currentUser.advertiserId)
        .then((contracts: Contract[]) => {
          if (contracts && contracts.length > 0 && verticalOffers.length > 0) {
            setLpContracts(contracts);
            console.log('Contracts:', contracts);
            const contractName = verticalOffers[0].name;
            const contractID = getContractID(contracts, contractName);
            if (!contractID) {
              resetStates();
              return;
            }
            setCampaignContractId(contractID);
            fetchAndSetCampaigns(verticalID, verticalOffers[0].id, contractID, start)
          } else {
            //NO CONTRACTS no campaigns
            resetStates();
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error.message);
          setIsLoading(false);
        });
    }
  }

  const handleTypeChange = (event: React.SyntheticEvent, type: string) => {
    resetStates();
    setVerticalID('');
    setLpType(type);
  };

  const handleClickVertical = (id: number) => {
    setIsLoading(true);
    if (id.toString() === verticalID) {
      setIsLoading(false);
      return;
    }
    const verticalOffers = getVerticalOffers(id.toString());
    if (!verticalOffers) {
      resetStates();
      return;
    }
    setVerticalOffers(verticalOffers);
    setVerticalID(id.toString());
    setOfferID(verticalOffers[0].id);
    fetchContractsAndCampaings(id.toString(), verticalOffers, 0);
  }

  const handleOfferChange = (event: SelectChangeEvent<string>) => {
    const { target: { value } } = event;
    const offerID = value;
    setOfferID(offerID);
    const selectedOffer = verticalOffers.find((offer) => offer.id === offerID)

    if (!selectedOffer || !lpContracts || lpContracts.length === 0) return;

    const contractID = getContractID(lpContracts, selectedOffer?.name || '');
    if (!contractID) {
      resetStates();
      return;
    }

    fetchAndSetCampaigns(verticalID, offerID, contractID, 0);
    setCampaignContractId(contractID);
  }

  const getContractID = (contracts: Contract[], contractName: string): number | null => {
    const foundContract = contracts.find(contract => contract.contractName === contractName);
    return foundContract ? foundContract.contractID : null; // ovde je bug bio
  };

  function resetStates() {
    setCampaignContractId(0);
    setLpCampaigns([]);
    setScheduledPrice('');
    setIsLoading(false);
  }

  const getVerticalData = (verticalID: string): VerticalVisualData => {
    const defaultData: VerticalVisualData = verticalVisualData[0]['1'];
    const foundData = verticalVisualData.find(item => verticalID in item)?.[verticalID];
    return foundData ? foundData : defaultData;
  };


  const getVerticalOffers = (verticalID: string): VerticalOffer[] => {
    let verticalOffers: VerticalOffer[] | undefined = []
    switch (lpType) {
      case 'leads':
        verticalOffers = verticalIDToLeadOffers.find(item => verticalID in item)?.[verticalID];
        break;
      case 'calls':
        verticalOffers = verticalIDToCallOffers.find(item => verticalID in item)?.[verticalID];
        break;

      default:
        verticalOffers = []
        break;
    }

    //const foundData = verticalIDToOffer.find(item => verticalID in item)?.[verticalID];
    return verticalOffers ? verticalOffers : [];
  };



  return (
    <Box
      component="main"
      className='dashboard'
    >
      <Toolbar />
      <Container className='container' maxWidth="lg">
        {currentUser ? (
          <Stack justifyContent="center" alignItems="center" spacing={3}>
            {isLoading ? (
              <>
                <CircularProgress />
                <Typography variant="h5" component="h4" align='center' margin={'0 30px 60px'}>Please wait</Typography>
              </>
            ) : (lpVerticals && lpVerticals?.length > 0) ? (
              <Box>
                <Tabs
                  value={lpType}
                  onChange={handleTypeChange}
                  variant="fullWidth"
                  centered
                  sx={{
                    '.MuiTab-root': {
                      '&.Mui-selected': {
                        background: '#fff',
                      },
                    },
                  }}
                >
                  <Tab icon={<AutoGraphIcon />} iconPosition="start" value={'leads'} label="Leads" />
                  <Tab icon={<CallIcon />} iconPosition="start" value={'calls'} label="Calls" />
                </Tabs>

                <Box sx={{ padding: 4, background: 'white' }}>
                  {/* <Typography variant="h4" component="h2" align='center' sx={{
                    margin: '15px 0 40px',
                    textTransform: 'capitalize',
                  }}
                  >
                    {lpType} Verticals
                  </Typography> */}
                  <Grid container spacing={2}>
                    {lpVerticals
                      .filter((ver: any) => [1, 2, 3, 5, 6, 12, 14, 22].includes(ver.verticalID))
                      .map((ver: any) => (
                        <Grid item md={3} xs={6} key={ver.verticalID}>
                          <div
                            style={{ backgroundImage: `url(${getVerticalData(ver.verticalID).image})` }}
                            className={`verticalCard ${verticalID == ver.verticalID ? 'active' : ''}`}
                            onClick={() => {
                              handleClickVertical(ver.verticalID);
                            }}
                          >
                            {/* <Avatar sx={{ bgcolor: getVerticalData(ver.verticalID).color, width: 64, height: 64 }}>
                              {getVerticalData(ver.verticalID).icon}
                            </Avatar> */}
                            <Typography>
                              {ver.verticalName}
                            </Typography>
                          </div>
                        </Grid>
                      ))}
                  </Grid>

                  {verticalID !== '' && verticalOffers.length > 0 ? (
                    <FormControl className='offerSelect' fullWidth>
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
                            {
                              off.name.includes('Application Only Campaigns') && lpType === 'leads' ? 'Specialty Campaigns ' + getVerticalName(verticalID) + ' - Leads'
                                : off.name.includes('Application Only Campaigns') && lpType === 'calls' ? 'Specialty Campaigns ' + getVerticalName(verticalID) + ' - Calls'
                                  : off.name
                            }
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : null}
                </Box>
              </Box>
            ) : (
              <p>No data available</p>
            )}
            {(lpCampaigns && lpCampaigns.length > 0 && !isLoading && campaignContractId !== 0 && scheduledPrice !== '' && rules) ? (
              <Fragment>
                <Typography sx={{ paddingTop: 3 }}>Campaigns for Vertical: {verticalID} - <strong>{getVerticalName(verticalID)}</strong></Typography>
                {/* <Alert sx={{ maxWidth: '800px' }} severity="info">
                  <strong>Disclamer:</strong> *15% discount applies when daily or weekly dispositions are provided to Lead Giant for leads only. 
                  <br/>Discount does not apply to inbound or transfer calls.
                </Alert> */}

                <CampaignList
                  campaignType={lpType}
                  campaignList={lpCampaigns}
                  contractId={campaignContractId}
                  scheduledPrice={scheduledPrice}
                  rules={rules}
                  verticalId={verticalID}
                />
                <Box textAlign="center" mt={4}>
                  {isLoadingCampaigns ? (
                    <CircularProgress />
                  ) : <Button onClick={loadMoreCampaigns} size='large' variant="contained" color="primary">
                    Show More
                  </Button>
                  }

                </Box>
              </Fragment>
            ) : ((lpCampaigns && lpCampaigns.length === 0) && !isLoading && offerID !== '') ? (
              <Box sx={{ padding: 2 }}>
                <Alert sx={{ maxWidth: '600px' }} severity="warning">
                  Currently you do not have any campaigns set up for this vertical
                </Alert>
              </Box>
            ) : null}
          </Stack>
        ) : currentUser === null && !isLoading ? (
          <Box>
            <Typography sx={{ marginBottom: 3 }}>You must Sign in to view this page</Typography>
            <Button href={'/sign-in'} variant="contained" endIcon={<PersonIcon />}>Sign In</Button>
          </Box>
        ) : null}
        <Copyright sx={{ pt: 6 }} />
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
