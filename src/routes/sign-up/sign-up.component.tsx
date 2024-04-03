import { useState } from 'react';
import { Button, CircularProgress, TextField, Box } from '@mui/material';
import { createUser } from '../../utils/firebase/firebase.utils';
//import { useForm } from 'react-hook-form';

const defaultSignUpFormFields = {
  displayName: '',
  email: '',
  password: '',
  advertiserId: '',
}

const SignUp = () => {

  const [formFields, setFormFields] = useState(defaultSignUpFormFields)
  const { displayName, email, password, advertiserId } = formFields
  const [loading, setLoading] = useState(false)

  const resetFormFields = () => {
    setFormFields(defaultSignUpFormFields)
  }

  //const { register, formState, reset } = useForm();

  const handleChange = (event: any) => {
    const { name, value } = event.target
    //console.log(event)
    //if validateField(name, value) error = false
    // else error = true, errorText 

    setFormFields({ ...formFields, [name]: value })
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setLoading(true)
    console.log('submitting...')
    try {
      const response = await createUser({ email, password, displayName, advertiserId })
      if (!response.success) {
        alert(response.error)
      }
      if (response.user) {
        console.log(response.user);
      }
      resetFormFields()
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        alert('User email already in use')
      }
      console.log('user creation error: ', err)
    }
    setLoading(false)
  }

  return (
    <Box sx={{ 
          padding: '3rem 0',
        }}>
      <h1>Sign-Up user for LGSS</h1>
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
            id="displayName"
            name="displayName"
            label="Name"
            type="text"
            autoComplete="name"
            onChange={handleChange}
            value={displayName}
          />
        </div>
        <div>
          <TextField
            required
            id="email"
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            onChange={handleChange}
            value={email}
          />
        </div>
        <div>
          <TextField
            required
            id="password"
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            onChange={handleChange}
            value={password}
          />
        </div>
        <div>
          <TextField
            required
            id="advertiserId"
            label="LeadsPedia Advetrtiser Id"
            name="advertiserId"
            type="text"
            onChange={handleChange}
            value={advertiserId}
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
              Submit
            </Button>
          }
        </div>
      </Box>
    </Box >
  );
}

export default SignUp