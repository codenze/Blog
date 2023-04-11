import React, { useState } from 'react'
import { Avatar } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CommentIcon from '@mui/icons-material/Comment';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import ReactQuill from 'react-quill';
import SignpostTwoToneIcon from '@mui/icons-material/SignpostTwoTone';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {setPosts} from './postSlice'
import ReportIcon from '@mui/icons-material/Report';
import "./css/Post.css"
import Comment from './Comment';
import { useEffect } from 'react';
import { setReports, addReports } from './likeSlice';

function Post({post, updatePost, posts}) {
  console.log(post);

  const [showModal, setShowModal] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [currentPost, setCurrentPost] = useState(post);
  const [comments, setComments] = useState([]);


  const post_id = currentPost ? post.id : null;
  const parent_post_id = currentPost ? post.parent_post_id : null;
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.currentUser);

  const [liked, setLiked] = useState(false);
  const [reported, setReported] = useState(false);



  const [showComments, setShowComments] = useState(false);


  const [value, setValue] = useState("");

  function handleEditSubmit(newContent) {
    // Send newContent to server for processing or storage
    setEditedContent(newContent);
    setShowModal(false);
  }

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
      console.log('Post updated:', data);
      updatePost(posts.map(post =>
        post.id === data.id ? { ...post, ...data } : post
      ))
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
      console.log('Post updated:', data);
      updatePost(posts.map(post =>
        post.id === data.id ? { ...post, ...data } : post
      ))
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
      console.log('Report created:', data);
      dispatch(addReports(data));

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
      console.log('Like created:', data);
      dispatch(addReports(data));

    })
    .catch(error => {
      console.error('Error updating post:', error);
    });
  }

  const addComments = (newComments) =>{
    setComments(newComments);
    console.log('comments::::', comments.length);
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
    console.log('data:::::', comments);
  }

  useEffect(()=> {
    getComments();
    console.log(comments);
  }, [])


  const getPosts = () =>{
    fetch('https://weathered-firefly-2748.fly.dev/posts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => dispatch(setPosts(data)))
  }





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
        { (!parent_post_id) ? ( (currentUser.role === 'user' ) && (
          <div className='header__upperRight'>
            <div className='header__options' onClick={() => setShowModal(true)}><MapsUgcIcon/> <span>Suggestion</span> </div>
          </div>
          )) : ( (currentUser.role === 'user' ) && (
            <div className='header__upperRight'>
            <div className='header__options' onClick={() => setShowModal(true)}><MapsUgcIcon/> <span>Parent Post</span> </div>
          </div>
          ))
        }
      </div>

      <div className='post__body'>
        <div className='post__content' dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      { (currentUser.role==='user') && (
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
      )}

      { (currentUser.role==='moderator') && (
        <div className='post__footer'>
          <div className={liked ? 'post__footer_option liked': 'post__footer_option'}  onClick={approvePost} >
            <CheckIcon/>
            <span>Approve</span>
          </div>
          <div className='post__footer_option' onClick={rejectPost} >
            <ClearIcon/>
            <span>Remove</span>
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
              <Modal onCancel={() => setShowModal(false)} initialValue={currentPost} currentUser={currentUser} updatePost={updatePost} posts={posts}>
              </Modal>
            )}
    </div>
  )
}

function Modal({ children, onCancel, initialValue, currentUser, updatePost, posts }) {
  const [value, setValue] = useState(initialValue.content);
  const isSuggestion = (initialValue.parent_post_id) ? true : false;
  console.log('initialValue:', initialValue);
  const submitPost = () => {
      if(value==""){
        return
      }
      const post = {
        user_id: currentUser.id,
        content: value,
        parent_post_id: initialValue.id,
        status: 'suggestion'
      };
      fetch('https://weathered-firefly-2748.fly.dev/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post
      })
      })
      .then(response => response.json())
      .then(data => {
        updatePost(posts.map(post =>
          post.id === data.id ? { ...post, ...data } : post
        ))
        console.log('New post created:', data);
      })
      .catch(error => {
        console.error('Error creating post:', error);
      });
      setValue("");
      onCancel();
  };

  const modules = {
    toolbar: [
      "bold", "italic","underline", "code-block", "blockquote", "link", "image",
      { header: [1, 2, 3, 4, 5] },
      { "color": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color'] },
      { list: "ordered" }, { list: "bullet" },
      { indent: "-1" }, { indent: "+1" },
      { align: [] }
    ]
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
            <h3 className="modal-title">{isSuggestion ? 'Parent Post' : 'Edit Suggestion'}</h3>
          <div className='right_most'>
            <div className='author'>
              <Avatar src={isSuggestion ? (initialValue.parent_post.user.photo) : initialValue.user.photo}/>
              <div className='author_information'>
                <span>Author</span>
                {isSuggestion ? (initialValue.parent_post.user.name) : initialValue.user.name}
              </div>
            </div>
          </div>
        </div>

        <div className='editor'>
          { !isSuggestion ? (
          <ReactQuill modules={modules}
                      theme="snow"
                      value={value}
                      onChange={setValue}/>
             ): (
            <div className='post__body'>
              <div className='post__content' dangerouslySetInnerHTML={{ __html: initialValue.content }} />
            </div>
             )
             }
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={onCancel}>
            Close
          </button>
          { !isSuggestion && (
          <button className="submit-button" onClick={submitPost}>
            Submit
          </button>
          )
          }
        </div>
      </div>
    </div>
  );
}


export default Post
