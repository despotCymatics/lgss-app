import { useEffect, useState } from 'react';
import AffiliateList, { LpAffiliate } from '../../components/dashboard-list/affiliate-list.component';
import { getData, GetRequest } from '../../utils/leadspedia/api';
import { InputLabel, MenuItem, Select, Link, Box, Toolbar, Container, Typography, FormControl, SelectChangeEvent } from '@mui/material';

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
  const [lpAffiliates, setLpAffiliates] = useState<any | null>(null);
  const [lpVerticals, setLpVerticals] = useState<any | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [vertical, setVertical] = useState<string>('')

  useEffect(() => {

    fetchAffiliates();
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

  const handleChangeVertical = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    setVertical(value);
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
          ) : lpAffiliates && lpVerticals ? (
            <div>
              <h2>Please select Vertical</h2>
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
                >
                  {lpVerticals.map((vertical: any) => (
                    <MenuItem
                      key={vertical.verticalID}
                      value={vertical.verticalID}
                    >
                      {vertical.verticalName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* <AffiliateList
                affiliateList={lpAffiliates}
              /> */}
            </div>
          ) : (
                <p>No data available</p>
              )}
        </div>
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </Box>
  );
}

export default Dashboard
