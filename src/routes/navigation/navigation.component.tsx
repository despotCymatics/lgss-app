import { useState, Fragment, useContext, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/user.context';
import { SignOutUser } from '../../utils/firebase/firebase.utils';
import { useLocation } from 'react-router-dom';
import { Link } from '@mui/material';
import './navigation.component.scss';

// const pages = ['Products', 'Pricing', 'Blog'];
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Navigation = () => {
  const { currentUser } = useContext(UserContext);
  const [initials, setInitials] = useState<string>('');

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSignOut = async () => {
    const result = await SignOutUser()
    console.log(result)
    navigate('/sign-in')
  }

  const location = useLocation();
  console.log("Current URL:", location.pathname);


  useEffect(() => {
    if (currentUser) {
      let displayName = currentUser?.displayName || '';
      if (displayName.includes(' ')) {
        let names = displayName.split(' ');
        setInitials(names[0][0] + names[1][0]);
      } else {
        setInitials(displayName[0]);
      }
    }
  }, [currentUser]);

  return (
    <Fragment>
      <AppBar className='appBar'>
        <Container maxWidth="xl">
          <Toolbar className='toolBar' disableGutters>
            <a href="/">
              <Box
                component="img"
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  marginRight: 2,
                  width: 150,
                }}
                src={require('../../assets/img/shop-logo.png')}
              />
            </a>
            <Box
              component="img"
              sx={{
                display: { xs: 'none', md: 'flex' },
                marginRight: 0,
                width: 150,
              }}
              src={require('../../assets/img/lg-logo.png')}
            />


            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon color='primary' />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">Dashboard</Typography>
                </MenuItem>
              </Menu>
            </Box>
            <Box
              component="img"
              sx={{
                display: { xs: 'flex', md: 'none' },
                marginRight: 2,
                width: 120,
              }}
              src={require('../../assets/img/shop-logo.png')}
            />

            {/* <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Dashboard
              </Button>
            </Box> */}
            {currentUser ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="User Menu">
                  <Button onClick={handleOpenUserMenu} sx={{ p: 0, textTransform: 'capitalize' }}>

                    {currentUser.displayName ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: 'white',
                        }}
                      >
                        <Typography
                          sx={{
                            padding: '5px',
                            color: '#000',
                          }}
                        >{currentUser.displayName + ' ' + currentUser.advertiserId}</Typography>
                        <Avatar
                          sx={{ backgroundColor: '#00B5AD' }}
                          alt={currentUser.displayName}
                          children={initials}
                        />
                      </Box>
                    ) : (
                      <Avatar alt="User">
                        <PersonIcon />
                      </Avatar>
                    )}

                  </Button>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center" onClick={handleSignOut}>Logout</Typography>
                  </MenuItem>
                  {(currentUser && currentUser.role == 'admin') && (
                    <MenuItem>
                      <Link href='/admin' textAlign="center">Admin</Link>
                    </MenuItem>
                  )}
                </Menu>
              </Box>
            ) : (location.pathname !== '/sign-up') ? (
              <Button href={'/sign-in'} variant="contained" endIcon={<PersonIcon />}>Sign In</Button>
            ) : null}

          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </Fragment>
  );
}
export default Navigation;