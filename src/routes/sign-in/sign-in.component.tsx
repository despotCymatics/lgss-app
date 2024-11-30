import { useContext, useState } from 'react';
import { Button, CircularProgress, TextField, Box } from '@mui/material';
import { signInUser } from '../../utils/firebase/firebase.utils';
import { UserContext } from '../../contexts/user.context';
import { useNavigate } from 'react-router-dom';

const defaultSignInFormFields = {
  email: '',
  password: '',
}

const SignIn = () => {
  const [formFields, setFormFields] = useState(defaultSignInFormFields)
  const { email, password } = formFields
  const [loading, setLoading] = useState(false)
  const { currentUser } = useContext(UserContext)
  const navigate = useNavigate();

  const resetFormFields = () => {
    setFormFields(defaultSignInFormFields)
  }

  const handleChange = (event: any) => {
    const { name, value } = event.target
    setFormFields({ ...formFields, [name]: value })
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await signInUser({ email, password })
      console.log(response)
      resetFormFields()
      navigate('/')
    } catch (error: any) {
      console.log(error)
      alert(error.message)
    }
    setLoading(false)
  }

  return (
    <div>
      {!currentUser ? (
        <Box sx={{ 
          padding: '6rem 0 3rem',
        }}>
          <h1>Sign In</h1>
          <Box
            component="form"
            sx={{
              padding: '1rem',
              '& .MuiTextField-root': { mb: 3, width: '100%', maxWidth: '420px' },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <div>
              <TextField
                required
                id="email"
                label="Email"
                type="email"
                name="email"
                onChange={handleChange}
                value={email}
              />
            </div>
            <div>
              <TextField
                id="password"
                label="Password"
                type="password"
                name="password"
                autoComplete="current-password"
                onChange={handleChange}
                value={password}
              />
            </div>
            <br />
            <div>
              {loading ?
                <CircularProgress />
                :
                <Button
                  type="submit"
                  size='large'
                  variant='contained'
                >
                  Sign In
            </Button>
              }
            </div>
          </Box>
        </Box>
      ) : null}
    </div>

  )
}

export default SignIn