import { Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './routes/dashboard/dashboard.component';
import Navigation from './routes/navigation/navigation.component'
import SignIn from './routes/sign-in/sign-in.component';
import SignUp from './routes/sign-up/sign-up.component';
import Admin from './routes/admin/admin.component';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Lato',
      'Roboto Condensed',
      'sans-serif'
    ].join(','),
  },
  palette: {
    primary: {
      main: '#00B5AD',
      contrastText: '#fff',
    }
  }
});


const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Routes>
          <Route path='/' element={<Navigation />} >
            <Route index element={<Dashboard />} />
            <Route path='sign-in' element={<SignIn />} />
            <Route path='sign-up' element={<SignUp />} />
            <Route path='admin' element={<Admin />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>

  );
}

export default App