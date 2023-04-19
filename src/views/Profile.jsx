import {Avatar, Box, Button, Grid, Typography} from '@mui/material';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useState, useEffect} from 'react';
import {useTag} from '../hooks/ApiHooks';
import {appId, mediaUrl} from '../utils/variables';
import {useNavigate, Link} from 'react-router-dom';

const Profile = () => {
  const {user} = useContext(MediaContext);

  const [profilePic, SetProfilePic] = useState({
    filename: 'https://placekitten.com/200/200',
  });

  const [backgroundPic, SetBackgroundPic] = useState({
    filename: 'https://placekitten.com/800/300',
  });

  const {getTag} = useTag();
  const navigate = useNavigate();

  const fetchProfilePicture = async () => {
    try {
      if (user) {
        const profilePictures = await getTag(appId + '_profilepicture_' + user.user_id);
        const profilePicture = profilePictures.pop();
        profilePicture.filename = mediaUrl + profilePicture.filename;
        SetProfilePic(profilePicture);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchBackgroundPicture = async () => {
    try {
      if (user) {
        const backgroundPictures = await getTag(appId + '_backgroundpicture_' + user.user_id);
        const backgroundPicture = backgroundPictures.pop();
        backgroundPicture.filename = mediaUrl + backgroundPicture.filename;
        SetBackgroundPic(backgroundPicture);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    console.log('testo')
    fetchProfilePicture();
    fetchBackgroundPicture();
  }, [user]);

  return (
    <>
      {user && (
        <>
          <Box sx={{maxWidth: 'md', margin: 'auto'}}>
            <Typography
              component="h1"
              variant="h2"
              textAlign="center"
              sx={{my: 6}}
            >
              Profile
            </Typography>
            <Avatar
                  src={backgroundPic.filename}
                  alt="Logo"
                  sx={{
                    borderRadius: 0,
                    boxShadow: 3,
                    width: 800,
                    height: 320,
                  }}
                />
            <Grid container justifyContent="center">
              <Grid item sx={{px: 3}}>
                <Avatar
                  src={profilePic.filename}
                  alt="Logo"
                  sx={{
                    top: -100,
                    left: -100,
                    boxShadow: 3,
                    width: 200,
                    height: 200,
                  }}
                />
              </Grid>
              <Grid item sx={{px: 3}}>
                <Typography component="h1" variant="h3" sx={{mt: 4}}>
                  <strong>{user.username}</strong>
                </Typography>          
                <Typography component="div" variant="h6" sx={{mt: 3}}>
                  <strong>Full name : </strong>{' '}
                  {user.full_name ? user.full_name : 'Has not set a full name'}
                </Typography>
                <Typography component="div" variant="h6" sx={{mt: 3}}>
                  <strong>Email : </strong> {user.email}
                </Typography>
                <Typography component="div" variant="h6" sx={{mt: 3}}>
                  <strong> User ID : </strong> {user.user_id}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{mt: 5}}
                  onClick={() => navigate('/profile/update')}
                >
                  Update User Info
                </Button>
                <Button variant="contained"
                  fullWidth
                  sx={{mt: 5}}
                  onClick={() => navigate('/logout')}
                  >
                    Logout
                </Button>
              </Grid>
            </Grid>
            <Grid container justifyContent="center" gap={5}>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{mt: 5}}
                  onClick={() => navigate('/home')}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
};

export default Profile;
