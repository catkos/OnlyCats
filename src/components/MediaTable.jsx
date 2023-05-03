import {
  IconButton,
  ImageList,
  Grid,
  useMediaQuery,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import {useMedia} from '../hooks/ApiHooks';
import MediaRow from './MediaRow';
import PropTypes from 'prop-types';
import {useContext, useEffect, useState} from 'react';
import WindowIcon from '@mui/icons-material/Window';
import MenuIcon from '@mui/icons-material/Menu';
import {NavLink} from 'react-router-dom';
import {useTheme} from '@mui/material/styles';
import {MediaContext} from '../contexts/MediaContext';

const MediaTable = ({
  myFilesOnly = false,
  targetUserFilesOnly = false,
  myFavouritesOnly = false,
}) => {
  const {mediaArray, deleteMedia, getMedia} = useMedia(
    myFilesOnly,
    targetUserFilesOnly,
    myFavouritesOnly
  );
  const {refreshPage} = useContext(MediaContext);
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedOption, setSelectedOption] = useState('file_id');
  const [arrayLength, setArrayLength] = useState(0);

  const [style, setStyle] = useState(true);

  useEffect(() => {
    getMedia();
  }, [refreshPage]);

  useEffect(() => {
    setArrayLength(mediaArray.length);
  }, [mediaArray]);

  const changeToGrid = () => {
    setStyle(true);
  };

  const changeToList = () => {
    setStyle(false);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (value === 1) {
      setSelectedOption('file_id');
    } else if (value === 2) {
      setSelectedOption('likes');
    } else if (value === 3) {
      setSelectedOption('rating');
    } else if (value === 4) {
      setSelectedOption('comments');
    }
  };

  return (
    <>
      <Grid sx={{py: 3}}>
        <Container>
          <Box display="flex" justifyContent="space-around" alignItems="center">
            <Typography
              sx={{
                fontSize: {xs: '1.2rem', sm: '1.5rem'},
                textAlign: 'center',
              }}
              component="h2"
              variant="h2"
            >
              {(myFilesOnly || targetUserFilesOnly) &&
                `${arrayLength} ${arrayLength === 1 ? 'post' : 'posts'}`}
              {myFavouritesOnly &&
                `${arrayLength} ${
                  arrayLength === 1 ? 'Liked post' : 'Liked posts'
                }`}
              {!myFilesOnly &&
                !targetUserFilesOnly &&
                !myFavouritesOnly &&
                'Discover cats'}
            </Typography>
            <FormControl
              sx={{
                width: '180px',
                textAlign: 'center',
              }}
            >
              <InputLabel id="select-label">Sort</InputLabel>
              <Select
                defaultValue={1}
                onChange={handleChange}
                labelId="select-label"
                id="sort-select"
                label="Sort"
                size="small"
              >
                <MenuItem value={1}>Newest</MenuItem>
                <MenuItem value={2}>Most liked</MenuItem>
                <MenuItem value={3}>Top rated</MenuItem>
                <MenuItem value={4}>Most commented</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Container>
      </Grid>
      <Container maxWidth="lg" sx={{padding: smallScreen ? 0 : 'auto'}}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          mb={!style && -1}
          alignItems="stretch"
          wrap="nowrap"
        >
          {style === true ? (
            <IconButton
              aria-label="window"
              onClick={changeToGrid}
              component={NavLink}
              sx={{width: smallScreen ? '50%' : '150px'}}
            >
              <WindowIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={changeToGrid}
              sx={{width: smallScreen ? '50%' : '150px'}}
            >
              <WindowIcon />
            </IconButton>
          )}
          {style === false ? (
            <IconButton
              aria-label="list"
              onClick={changeToList}
              component={NavLink}
              sx={{width: smallScreen ? '50%' : '150px'}}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={changeToList}
              sx={{width: smallScreen ? '50%' : '150px'}}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Grid>
        <Grid
          container
          direction="row-reverse"
          alignItems="stretch"
          maxWidth="lg"
          justifyContent="center"
        >
          {/* chooses correct css for list/grind */}
          <ImageList
            cols={!style ? 1 : smallScreen ? 3 : 4}
            gap={!style ? 0 : undefined}
            direction={style ? 'row' : undefined}
            sx={{
              width: !style
                ? {sx: '100%', sm: '500px'}
                : {sx: '100%', sm: '100%'},
              objectFit: !style ? 'contain' : undefined,
            }}
          >
            {/* chooses correct sort based on select input */}
            {selectedOption === 'comments' &&
              mediaArray
                .sort((a, b) => b.comments.length - a.comments.length)
                .map((item, index) => {
                  return (
                    <MediaRow
                      key={index}
                      file={item}
                      deleteMedia={deleteMedia}
                      style={style}
                      mediaArray={mediaArray}
                    />
                  );
                })}
            {selectedOption === 'rating' &&
              mediaArray
                .sort((a, b) => b.averageRating - a.averageRating)
                .map((item, index) => {
                  return (
                    <MediaRow
                      key={index}
                      file={item}
                      deleteMedia={deleteMedia}
                      style={style}
                      mediaArray={mediaArray}
                    />
                  );
                })}
            {selectedOption === 'likes' &&
              mediaArray
                .sort((a, b) => b.likes.length - a.likes.length)
                .map((item, index) => {
                  return (
                    <MediaRow
                      key={index}
                      file={item}
                      deleteMedia={deleteMedia}
                      style={style}
                      mediaArray={mediaArray}
                    />
                  );
                })}
            {selectedOption === 'file_id' &&
              mediaArray
                .sort((a, b) => b.file_id - a.file_id)
                .map((item, index) => {
                  return (
                    <MediaRow
                      key={index}
                      file={item}
                      deleteMedia={deleteMedia}
                      style={style}
                      mediaArray={mediaArray}
                    />
                  );
                })}
          </ImageList>
        </Grid>
      </Container>
    </>
  );
};

MediaTable.propTypes = {
  myFilesOnly: PropTypes.bool,
  targetUserFilesOnly: PropTypes.bool,
  myFavouritesOnly: PropTypes.bool,
};

export default MediaTable;
