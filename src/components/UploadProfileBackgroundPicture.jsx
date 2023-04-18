import {Box, Button, Grid, Slider, Typography} from '@mui/material';
import useForm from '../hooks/FormHooks';
import {useContext, useState, useEffect} from 'react';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {useNavigate} from 'react-router-dom';
import {appId, mediaUrl} from '../utils/variables';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {MediaContext} from '../contexts/MediaContext';

const UploadProfileBackgroundPicture = () => {
  const {user} = useContext(MediaContext);
  const {postMedia} = useMedia();
  const {postTag, getTag} = useTag();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(
    'https://placehold.co/300x300?text=Choose-Background Picture'
  );

  const fetchBackgroundPicture = async () => {
    try {
      if (user) {
        const backgroundPictures = await getTag(appId + '_backgroundpicture_' + user.user_id);
        const backGroundPicture = backgroundPictures.pop();
        backGroundPicture.filename = mediaUrl + backGroundPicture.filename;
        setSelectedImage(backGroundPicture.filename);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchBackgroundPicture();
  }, [user]);

  const doUpload = async () => {
    try {
      const data = new FormData();
      data.append('title', 'Profile Picture');
      data.append('file', file);
      const token = localStorage.getItem('token');
      const uploadResult = await postMedia(data, token);
      const tagResult = await postTag(
        {
          file_id: uploadResult.file_id,
          tag: appId + '_backgroundpicture_' + user.user_id,
        },
        token
      );
      navigate(0);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleFileChange = (event) => {
    event.persist();
    setFile(event.target.files[0]);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setSelectedImage(reader.result);
    });
    reader.readAsDataURL(event.target.files[0]);
  };

  const {handleSubmit} = useForm(
    doUpload,
  );

  return (
    <Box sx={{maxWidth: 'md', margin: 'auto'}}>
      <Grid container direction={'row'} justifyContent="center" sx={{mt: 2}}>
        <Grid item xs={5} sx={{mt: 0}}>
          <img
            src={selectedImage}
            alt="preview"
            style={{
              width: '100%',
              height: '100%',
            }}
          ></img>
        </Grid>
        <Grid item xs={5} sx={{pl: 2}}>
          <Grid
            container
            direction={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            sx={{mt: 0}}
          >
            <ValidatorForm onSubmit={handleSubmit} noValidate>
              <TextValidator
                sx={{mb: 1}}
                onChange={handleFileChange}
                type="file"
                name="file"
                accept="image/*, video/*, audio/*"
              />
              <Button variant="contained" fullWidth type="submit">
                Update Background Picture
              </Button>
            </ValidatorForm>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UploadProfileBackgroundPicture;