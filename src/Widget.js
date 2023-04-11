import React, { useState } from 'react';
import './css/Widget.css';
import InfoIcon from '@mui/icons-material/Info';
import AssistantIcon from '@mui/icons-material/Assistant';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import ForumIcon from '@mui/icons-material/Forum';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import PeopleIcon from '@mui/icons-material/People';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import { useSelector } from 'react-redux';
import ListTwoToneIcon from '@mui/icons-material/ListTwoTone';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import { useDispatch } from 'react-redux';
import { setWindow, setQuery, setSignOut } from './authSlice';

function Widget() {
  const dispatch = useDispatch();

  const window = useSelector(state => state.auth.window);
  const query = useSelector(state => state.auth.query);

  const currentUser = useSelector(state => state.auth.currentUser);

  const options = ['Feed', 'Suggestions', 'Reports', 'Community', 'Profile', 'Comments', 'Likes', 'Posts'];

  const [showProfile, setShowProfile] = useState(false);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  }

  const handleChange = (options, flag=false) => {
    console.log(options);
    if (flag) {
      console.log('dispatch(setQuery(options));');
      dispatch(setQuery(options));
    } else {
      console.log('dispatch(setWindow(options));');
      dispatch(setWindow(options));
    }
  }

  return (
    <div className='widget'>
      <div className='widget__bottom'>
        <div className={ (window===options[0]) ? 'menue__header active_tab' : 'menue__header'}
          onClick = {() => handleChange(options[0])}>
          <RssFeedIcon/>
          <h5>{options[0]}</h5>
        </div>
        <div >
        { (
          <div className={ (window===options[7]) ? 'menue__header active_tab' : 'menue__header'}
            onClick = {() => handleChange(options[7])}>
            <DynamicFeedIcon/>
            <h5>{options[7]}</h5>
          </div>)
        }
        {
           (
            window===options[7] && (
            <ul className='subheader'>
                <div className={ (query == 'approved') ? 'menue__subheader active_query' : 'menue__subheader'}
                onClick = {() => handleChange('approved', true)}  >
                  <ListTwoToneIcon/>
                  <h5>{'Approved'}</h5>
                </div>
                <div className={ (query == 'pending') ? 'menue__subheader active_query' : 'menue__subheader'}
                onClick = {() => handleChange('pending', true)}  >
                  <ListTwoToneIcon/>
                  <h5>{'Pending'}</h5>
                </div>
                <div className={ (query == 'reject') ? 'menue__subheader active_query' : 'menue__subheader'}
                onClick = {() => handleChange('reject', true)}  >
                  <ListTwoToneIcon/>
                  <h5>{'Rejected'}</h5>
                </div>
            </ul>
            )
          )
        }

          </div>

        { (
          <div className={ (window===options[5]) ? 'menue__header active_tab' : 'menue__header'}
            onClick = {() => handleChange(options[5])}>
            <CommentIcon/>
            <h5>{options[5]}</h5>
          </div>
        )
        }
        { currentUser.role !== 'moderator' && (
          <div className={ (window===options[6]) ? 'menue__header active_tab' : 'menue__header'}
            onClick = {() => handleChange(options[6])}>
            <ThumbUpAltTwoToneIcon/>
            <h5>{options[6]}</h5>
          </div>
        )
        }

        {
           (
            window===options[6] && (
            <ul className='subheader'>
                <div className={ (query == 'post') ? 'menue__subheader active_query' : 'menue__subheader'}
                 onClick = {() => handleChange('post', true)}  >
                  <ListTwoToneIcon/>
                  <h5>{'posts'}</h5>
                </div>
                <div className={ (query == 'comment') ? 'menue__subheader active_query' : 'menue__subheader'}
                 onClick = {() => handleChange('comment', true)}  >
                  <ListTwoToneIcon/>
                  <h5>{'comments'}</h5>
                </div>
            </ul>
            )
          )
        }

        {  (
          <div className={ (window===options[1]) ? 'menue__header active_tab' : 'menue__header'}
            onClick = {() => handleChange(options[1])}>
            <ForumIcon/>
            <h5>{options[1]}</h5>
          </div>
        )
        }
        { (
          <div className={ (window===options[2]) ? 'menue__header active_tab' : 'menue__header'}
            onClick = {() => handleChange(options[2])}>
            <AnnouncementIcon/>
            <h5>{options[2]}</h5>
          </div>
        )
        }
        {
           (
            window===options[2] && (
            <ul className='subheader'>
                <div className={ (query == 'post') ? 'menue__subheader active_query' : 'menue__subheader'}
                 onClick = {() => handleChange('post', true)} >
                  <ListTwoToneIcon/>
                  <h5>{'posts'}</h5>
                </div>
                <div className={ (query == 'comment') ? 'menue__subheader active_query' : 'menue__subheader'}
                 onClick = {() => handleChange('comment', true)} >
                  <ListTwoToneIcon/>
                  <h5>{'comments'}</h5>
                </div>
            </ul>
            )
          )
        }
        { currentUser.role === 'admin' && (
          <div className={ (window===options[3]) ? 'menue__header active_tab' : 'menue__header'}
            onClick = {() => handleChange(options[3])}>
            <PeopleIcon/>
            <h5>{options[3]}</h5>
          </div>
        )
        }
        <div className={ (window===options[4]) ? 'menue__header active_tab' : 'menue__header'}
          onClick = {() => handleChange(options[4])}>
          <AccountBoxTwoToneIcon/>
          <h5>{options[4]}</h5>
        </div>
      </div>
    </div>
  )
}

export default Widget;
