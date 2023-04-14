import React, { useState } from 'react'
import { Avatar } from '@mui/material'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CommentIcon from '@mui/icons-material/Comment';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ReportIcon from '@mui/icons-material/Report';
import "../../css/Post.css"
import Comment from '../Comment/Comment';
import { useEffect } from 'react';
import { addReports } from '../../slices/likeSlice';
import { setReload } from '../../slices/authSlice';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LaunchIcon from '@mui/icons-material/Launch';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import Sugesstion from './Sugesstion';
import timeDiff from '../../time'
function Post({post, updatePost, posts}) {
  const [showModal, setShowModal] = useState(false);
  const [currentPost] = useState(post);
  const [comments, setComments] = useState([]);

  const icons = {'approved': CheckCircleIcon,
                  'pending': RotateLeftIcon,
                  'suggestion': TipsAndUpdatesIcon,
                  'reject': UnpublishedIcon};
  const statuses = {'approved': 'Published',
                  'pending': 'Pending',
                  'suggestion': 'Suggestion',
                  'reject': 'Unpublished'};
  const Icon = icons[post.status];
  const status = statuses[post.status];

  const post_id = currentPost ? post.id : null;
  const parent_post_id = currentPost ? post.parent_post_id : null;
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.currentUser);

  const likes = useSelector(state => state.like.likes);
  const post_like = likes.find(like => like.user_id === currentUser.id && like.post_id === post_id);
  const isLiked = post_like && post_like.status === 'active' ? true : false;
  const [liked, setLiked] = useState(isLiked);

  const reports = useSelector(state => state.like.reports);
  const post_report = reports.find(report => report.user_id === currentUser.id && report.post_id === post_id);
  const isReported = post_report && post_report.status === 'active' ? true : false;
  const [reported, setReported] = useState(isReported);

  const [showComments, setShowComments] = useState(false);

  // function timeDiff(dateString) {
  //   const date = new Date(dateString);
  //   const now = new Date();
  //   const diff = now.getTime() - date.getTime();

  //   const sec = Math.floor(diff / 1000);
  //   const min = Math.floor(sec / 60);
  //   const hr = Math.floor(min / 60);
  //   const day = Math.floor(hr / 24);
  //   const month = Math.floor(day / 30);
  //   const year = Math.floor(month / 12);

  //   if (year > 0) {
  //     return `${year} year${year === 1 ? '' : 's'} ago`;
  //   } else if (month > 0) {
  //     return `${month} month${month === 1 ? '' : 's'} ago`;
  //   } else if (day > 0) {
  //     return `${day} day${day === 1 ? '' : 's'} ago`;
  //   } else if (hr > 0) {
  //     return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  //   } else if (min > 0) {
  //     return `${min} minute${min === 1 ? '' : 's'} ago`;
  //   } else {
  //     return `${sec} second${sec === 1 ? '' : 's'} ago`;
  //   }
  // }


  const rejectPost = (e) => {

    fetch(`https://weathered-firefly-2748.fly.dev/posts/${post_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      post: {
        status: 'reject'
      }
    })
    })
    .then(response => response.json())
    .then(data => {
      updatePost(posts.map(post =>
        post.id === data.id ? { ...post, ...data } : post
      ));
      dispatch(setReload('post'));
    })
    .catch(error => {
      console.error('Error updating post:', error);
    });
  }


  const approvePost = (e) => {

    fetch(`https://weathered-firefly-2748.fly.dev/posts/${post_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      post: {
        status: 'approved'
      }
    })
    })
    .then(response => response.json())
    .then(data => {
      updatePost(posts.map(post =>
        post.id === data.id ? { ...post, ...data } : post
      ));
      dispatch(setReload('post'));
    })
    .catch(error => {
      console.error('Error updating post:', error);
    });
  }

  const reportPost = (e) => {

    setReported(!reported);

    fetch(`https://weathered-firefly-2748.fly.dev/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      report: {
        user_id: currentUser.id,
        post_id: post.id,
        status: 'active'
      }
    })
    })
    .then(response => response.json())
    .then(data => {
      dispatch(addReports(data));
      dispatch(setReload('report'));
    })
    .catch(error => {
      console.error('Error updating post:', error);
    });
  }

  const likePost = (e) => {

    setLiked(!liked);

    fetch(`https://weathered-firefly-2748.fly.dev/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      like: {
        user_id: currentUser.id,
        post_id: post.id,
        status: 'active'
      }
    })
    })
    .then(response => response.json())
    .then(data => {
      dispatch(addReports(data));
      dispatch(setReload('like'));
    })
    .catch(error => {
      console.error('Error updating post:', error);
    });
  }

  const addComments = (newComments) =>{
    setComments(newComments);
  }


  const getComments = () =>{
    fetch(`https://weathered-firefly-2748.fly.dev/posts/${post_id}/comments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => setComments(data))
  }

  useEffect(()=> {
    getComments();
  }, [])


  return (
    <div className='posts'>
      <div className='post__header'>
        <div className='post__headerLeft'>
          <Avatar src={post.user && post.user.photo}/>
          <div className='post__profile_details'>
            <h3>{currentPost.user.name}</h3>
            <p>{currentPost.user.role}</p>
          </div>
        </div>
        { (currentUser.role === 'user') ? ((!parent_post_id) ? ( (currentUser.role === 'user' && post.status === 'approved' ) && (
          <div className='header__upperRight'>
            <div className='header__options' onClick={() => setShowModal(true)}><MapsUgcIcon/> <span>Suggestion</span> </div>
          </div>
          )) : ( (currentUser.role === 'user' ) && (
            <div className='header__upperRight'>
              <div className='header__options' onClick={() => setShowModal(true)}><LaunchIcon/> <span>Parent Post</span> </div>
            </div>
          ))
          ) : (
            <div className='header__upperRight'>
              <div className='header__options'> <Icon></Icon> <span>{status}</span> </div>
            </div>
          )
        }
      </div>
      <div className='time'><small>{timeDiff(post.updated_at)}</small></div>

      <div className='post__body'>
        <div className='post__content' dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      { (currentUser.role==='user') && (
        post.status !== 'approved' ? (
        <div className='post__footer'>
          <small>{status}</small>
        </div>)
        : (
        <div className='post__footer'>
          <div className={liked ? 'post__footer_option liked': 'post__footer_option'}  onClick={likePost} >
            <ThumbUpAltIcon/>
            <span>{liked ? 'Liked' : 'Like'}</span>
          </div>
          <div className='post__footer_option' onClick={() => setShowComments(!showComments)} >
            <CommentIcon/>
            <span>Comment</span>
          </div>
          <div className={reported ? 'post__footer_option liked': 'post__footer_option'}  onClick={reportPost} >
            <ReportIcon/>
            <span>{reported ? 'Reported' : 'Report'}</span>
          </div>
        </div>
        )
      )}

      { (currentUser.role!=='user') && (
        <div className='post__footer'>
          <div className={liked ? 'post__footer_option liked': 'post__footer_option'}  onClick={approvePost} >
            <CheckIcon/>
            <span>{(post.status==='approved') ? 'Approved' : ((post.status==='suggestion') ? 'Suggested' : 'Approve')}</span>
          </div>
          <div className='post__footer_option' onClick={rejectPost} >
            <ClearIcon/>
            <span>{(post.status==='reject') ? 'Unpublished' : 'Unpublish'}</span>
          </div>
        </div>
      )}

      { showComments && (
        comments.map((comment) => {
          if (!comment.parent_comment_id){
            return <Comment key={comment.id} comment={comment} post={currentPost} currentUser={currentUser} addComments={addComments} comments={comments}/>
          }
        })
      )}

      {showComments && (
        <Comment newComment={true} post={currentPost} currentUser={currentUser} addComments={addComments} comments={comments}/>
      )}

        {showModal && (
              <Sugesstion onCancel={() => setShowModal(false)} initialValue={currentPost} currentUser={currentUser} updatePost={updatePost} posts={posts}/>
            )}
    </div>
  )
}


export default Post
