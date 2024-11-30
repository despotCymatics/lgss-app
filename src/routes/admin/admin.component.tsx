import React, { useContext, useEffect, useState } from 'react';
import { LPUser, fetchUsers, updateUser } from '../../utils/firebase/firebase.utils';
import { UserContext } from '../../contexts/user.context';
import { Box, Button, Container, Link, List, ListItem, ListItemText, Modal, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const defaultEditUserFormFields = {
    id: '',
    displayName: '',
    email: '',
    advertiserId: '',
}

const Admin: React.FC = () => {
    const { currentUser, loginUser } = useContext(UserContext)
    const [users, setUsers] = useState<LPUser[]>([]);
    const [openEditUserModal, setOpenEditUserModal] = React.useState(false);
    const [formFields, setFormFields] = useState(defaultEditUserFormFields)
    const { id, displayName, email, advertiserId } = formFields
    const navigate = useNavigate();

    const handleOpen = () => setOpenEditUserModal(true);
    const handleClose = () => setOpenEditUserModal(false);

    const resetFormFields = () => {
        setFormFields(defaultEditUserFormFields)
    }

    function displayUsers() {
        const userList = fetchUsers();
        userList.then(users => setUsers(users));
    }

    useEffect(() => {
        displayUsers();
    }, []);

    function editUser(user: LPUser) {
        handleOpen();
        console.log(`Editing user with id: ${user.id}`);
        setFormFields(user);
    }

    const handleChange = (event: any) => {
        const { name, value } = event.target
        setFormFields({ ...formFields, [name]: value })
    }

    const hanldeUpdateUser = () => {
        console.log('updating user...');
        console.log(formFields);
        updateUser(formFields);
        handleClose();
        resetFormFields();
        displayUsers();
    }

    const handleLoginAsUser = (user: LPUser) => {
        if (!user.advertiserId) {
            console.error('User does not have an advertiserId');
            alert('User does not have an advertiserId');
            return;
        }
        loginUser(user.advertiserId);
        navigate('/');
    }

    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 6,
        '& .MuiTextField-root': { mb: 3, width: '100%', maxWidth: '420px' },
    };

    return (
        currentUser && currentUser.role === 'admin' ? (
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    minHeight: 'calc(100vh - 80px)',
                    padding: '70px 0',
                }}
            >
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <h1>Users</h1>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {users.map(user => (
                            <ListItem key={user.id}>
                                <ListItemText primary={user.displayName} secondary={user.email} />
                                <Link
                                    sx={{ padding: '0 15px', cursor: 'pointer' }}
                                    onClick={() => {
                                        editUser(user);
                                    }}>Edit</Link>
                                <Link
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        handleLoginAsUser(user);
                                    }}>Login as user</Link>
                            </ListItem>
                        ))}
                    </List>
                </Container>
                <Modal
                    open={openEditUserModal}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={modalStyle}>

                        <Typography variant='h3'>Edit User</Typography>
                        <br />
                        <br />
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
                        <div style={{ display: "none" }}>
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
                                id="advertiserId"
                                label="LeadsPedia Advetrtiser Id"
                                name="advertiserId"
                                type="text"
                                onChange={handleChange}
                                value={advertiserId}
                            />
                        </div>

                        <Button variant="contained" onClick={hanldeUpdateUser}>Submit</Button>
                        <Button onClick={handleClose}>Close</Button>

                    </Box>
                </Modal>
            </Box>
        ) : (
            <div style={{ padding: '100px 20px' }}>
                <h1>Admin Only</h1>
                <p>You must be an admin to view this page.</p>
            </div>
        )
    );
};

export default Admin;
