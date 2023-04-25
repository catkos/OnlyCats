import {Avatar, Box, Button, Rating, Typography} from '@mui/material';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useState, useEffect} from 'react';
import {useMedia, useRating, useTag} from '../hooks/ApiHooks';
import {appId, mediaUrl} from '../utils/variables';
import {useNavigate} from 'react-router-dom';
import MediaTable from '../components/MediaTable';

const Profile = () => {
  const {user, setUser} = useContext(MediaContext);
  const {getTag} = useTag();
  const navigate = useNavigate();
  const {getRatingsById} = useRating();
  const {getAllMediaByCurrentUser} = useMedia();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser]);

  const [profilePic, setProfilePic] = useState({
    filename: 'https://placekitten.com/200/200',
  });
  const [backgroundPic, setBackgroundPic] = useState({
    filename: 'https://placekitten.com/800/300',
  });
  const [profileDescription, setprofileDescription] = useState(
    'No profile text yet!'
  );
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [postCount, setPostCount] = useState(0);

  const fetchProfilePicture = async () => {
    try {
      if (user) {
        const profilePictures = await getTag(
          appId + '_profilepicture_' + user.user_id
        );
        const profilePicture = profilePictures.pop();
        profilePicture.filename = mediaUrl + profilePicture.filename;
        setProfilePic(profilePicture);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchBackgroundPicture = async () => {
    try {
      if (user) {
        const backgroundPictures = await getTag(
          appId + '_backgroundpicture_' + user.user_id
        );
        const backgroundPicture = backgroundPictures.pop();
        backgroundPicture.filename = mediaUrl + backgroundPicture.filename;
        setBackgroundPic(backgroundPicture);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchProfileDescription = async () => {
    try {
      if (user) {
        const profilePictures = await getTag(
          appId + '_profilepicture_' + user.user_id
        );
        const profileText = profilePictures.pop();
        setprofileDescription(profileText.description);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const fetchAllRatings = async () => {
    try {
      const token = localStorage.getItem('token');
      const mediaInfo = await getAllMediaByCurrentUser(token);
      let sum = 0;
      let count = 0;
      for (const file of mediaInfo) {
        await sleep(200);
        const ratings = await getRatingsById(file.file_id);
        if (ratings.length !== 0) {
          for (const obj of ratings) {
            sum += obj.rating;
            count++;
          }
        }
      }
      setRatingCount(count);
      const average = sum / count;
      setRating(average);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProfilePicture();
    fetchBackgroundPicture();
    fetchProfileDescription();
    fetchAllRatings();
    setTimeout(() => {
      countPosts();
    }, 1000);
  }, []);

  const countPosts = () => {
    const itemCount = document.querySelectorAll('.post').length;
    setPostCount(itemCount);
    console.log('itemcount', itemCount);
  };

  return (
    <>
      <Box sx={{maxWidth: '1200px', margin: 'auto', pt: {xs: 8, sm: 1, md: 1}}}>
        <Avatar
          src={backgroundPic.filename}
          alt="Logo"
          sx={{
            borderRadius: 0,
            boxShadow: 3,
            maxWidth: '1200px',
            width: '100%',
            height: {xs: '150px', md: '300px'},
            maxHeight: '300px',
          }}
        />
        <Avatar
          src={profilePic.filename}
          alt="Logo"
          sx={{
            boxShadow: 3,
            borderColor: 'white',
            position: 'relative',
            height: {xs: '150px', sm: '150px', md: '200px'},
            width: {xs: '150px', sm: '150px', md: '200px'},
            top: {xs: '-75px', sm: '-75px', md: '-100px'},
            left: {xs: '0', sm: '50px', md: '50px'},
            margin: {xs: 'auto', sm: 'initial'},
          }}
        />
        <Box
          display="flex"
          justifyContent="center"
          sx={{
            maxWidth: '1000px',
            width: '100%',
            margin: 'auto',
            mt: {xs: -8, md: -23},
            flexDirection: {xs: 'row', sm: 'row'},
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            textAlign="center"
            sx={{
              px: {xs: 2, md: 6},
              py: {xs: 1, md: 1},
              justifyContent: {xs: 'center', sm: 'center'},
              alignItems: {xs: 'center', sm: 'flex-start'},
            }}
          >
            <Typography component="p" variant="h1" sx={{mt: 1}}>
              {user.full_name ? user.full_name : 'Has not set a full name'}
            </Typography>
            <Typography component="p" variant="body4" sx={{mt: 1}}>
              {'@' + user.username}
            </Typography>
            <Rating
              name="read-only"
              size="large"
              precision={0.5}
              value={rating.toFixed(2)}
              readOnly
              sx={{mt: 1}}
            />
            <Typography component="legend">
              {rating.toFixed(2)} ({ratingCount} ratings)
            </Typography>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            sx={{
              px: {xs: 2, sm: 2},
              pl: {xs: 0, sm: 2},
              py: {xs: 1, md: 1},
              width: {xs: '200px'},
            }}
          >
            <Button
              variant="contained"
              sx={{
                mt: 2,
                mr: {xs: 0, sm: 0},
              }}
              onClick={() => navigate('/profile/update')}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              sx={{mt: 2, mr: {xs: 0, sm: 0}}}
              onClick={() => navigate('/logout')}
            >
              Logout
            </Button>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Typography
            component="p"
            variant="body3"
            alignSelf="center"
            sx={{maxWidth: '700px', p: 4, pl: {xs: 4, md: 10}}}
          >
            {profileDescription}
          </Typography>
          <Typography
            component="p"
            variant="h2"
            sx={{maxWidth: '1000px', px: 3, py: 2}}
          >
            {postCount} {postCount === 1 ? 'post' : 'posts'}
          </Typography>
        </Box>
      </Box>
      <MediaTable myFilesOnly={true} />
      <Button
        variant="contained"
        sx={{mt: 5}}
        onClick={() => navigate('/home')}
      >
        Back
      </Button>
    </>
  );
};

export default Profile;
