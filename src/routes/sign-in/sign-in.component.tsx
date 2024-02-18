import { useState, useContext } from 'react';
import { Button, CircularProgress, TextField, Box } from '@mui/material';
import { signInUser } from '../../utils/firebase/firebase.utils';
import { UserContext } from '../../contexts/user.context';


const defaultSignInFormFields = {
  email: '',
  password: '',
}

const SignIn = () => {
  const [formFields, setFormFields] = useState(defaultSignInFormFields)
  const { email, password } = formFields
  const [loading, setLoading] = useState(false)

  const { setCurrentUser } = useContext(UserContext)

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
    console.log('signIn...')
    try {
      const response = await signInUser({email, password})
      console.log(response)
      setCurrentUser(response.user)
      resetFormFields()
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  return (
    <div>
      <h1>Sign In</h1>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50%' },
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
    </div>
)
}

export default SignIn