import {Box, Grid, Typography} from '@mui/material';
import PropTypes from 'prop-types';
import {useState, useEffect, useContext} from 'react';
import UserHeader from './UserHeader';
import {MediaContext} from '../contexts/MediaContext';

const CommentRow = ({file, fetchComments}) => {
  const [refreshData, setRefreshData] = useState(false);
  const {user} = useContext(MediaContext);

  useEffect(() => {
    fetchComments();
  }, [refreshData]);

  return (
    <Box
      sx={{
        p: 2,
        my: 2,
        backgroundColor: '#F4DCE1',
        borderRadius: '1.25rem',
        boxShadow:
          '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
      }}
    >
      {user ? (
        <>
          <UserHeader
            file={file}
            comment={true}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
          />
          <Typography component="p" variant="body1">
            {file.comment}
          </Typography>
        </>
      ) : (
        <Grid container>
          <Grid item xs={8}>
            <Typography component="p" variant="body1">
              {file.comment}
            </Typography>
          </Grid>
          <Grid item xs={true}>
            <UserHeader
              file={file}
              comment={true}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

CommentRow.propTypes = {
  file: PropTypes.object.isRequired,
  fetchComments: PropTypes.func.isRequired,
};

export default CommentRow;
