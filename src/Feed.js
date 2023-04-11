import React from 'react'
import { Avatar } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import './css/Feed.css'
import Post from './Post';
import ReactQuill from 'react-quill';
import '../node_modules/react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {setPosts} from './postSlice'
import { setUsers } from './userSlice';
import User from './User';
import Profile from './Profile';
import { setComments } from './commentSlice';
import {setLikes, setReports} from './likeSlice';
import Comment from './Comment';

function Feed() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.currentUser);
  const window = useSelector(state => state.auth.window);
  const query = useSelector(state => state.auth.query);
  const likes = useSelector(state => state.like.likes);
  const reports = useSelector(state => state.like.reports);

  let users= useSelector(state => state.user.users);
  let posts= useSelector(state => state.post.posts);
  let comments= useSelector(state => state.comment.comments);

  const [ value, setValue ] = useState("");
  const submitPost = (e)=> {
    e.preventDefault();
    if(value === ""){
      return
    }
    const post = {
      user_id: currentUser.id,
      content: value,
      status: 'pending'
    };
    fetch('http://localhost:3000/posts', {
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
      dispatch(setPosts([...posts, data]));
      console.log('Post created:', data);
    })
    .catch(error => {
      console.error('Error creating post:', error);
    });
    setValue("");
  }

  const getUsers = () =>{
    fetch('http://localhost:3000/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => dispatch(setUsers(data)))
  }


  const getComments = () =>{
    fetch('http://localhost:3000/comments', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => dispatch(setComments(data)))
    console.log('comments:', comments);
  }

  const getPosts = () =>{
    fetch('http://localhost:3000/posts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => dispatch(setPosts(data)))
  }

  const getLikes = () =>{
    fetch('http://localhost:3000/likes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => dispatch(setLikes(data)))
  }

  const getReports = () =>{
    fetch('http://localhost:3000/reports', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => dispatch(setReports(data)))
  }

  const updatePost= (newPosts) => {
    dispatch(setPosts(newPosts));
  }

  useEffect(()=> {
    getUsers();
    getPosts();
    getComments();
    getLikes();
    getReports();
  }, [])

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
    <div className='feed'>
    { (currentUser.role==='user' && window==='Feed') && (
      <div className='feed__input'>
        <div className='feed__form'>
          <Avatar src={currentUser.photo}/>
          <div className='editor'>
            <ReactQuill modules={modules}
                        theme="snow"
                        value={value}
                        onChange={setValue}/>
          </div>
        </div>
        <div className='feed__options'>
          <div className='option' onClick={submitPost}>
            <span>Publish</span>
            <SendIcon/>
          </div>
        </div>
      </div>
    )}
      { (window==='Feed') && (
        posts.map((post) => {
          if (currentUser.role==='moderator' && post.status==='pending'){
            return <Post key={post.id} post={post} currentUser={currentUser} posts={posts} updatePost={updatePost}/>
          }
          if (currentUser.role==='user' && post.status==='approved'){
            return <Post key={post.id} post={post} currentUser={currentUser} posts={posts} updatePost={updatePost}/>
          }
          if (currentUser.role==='admin'){
            return <Post key={post.id} post={post} currentUser={currentUser} posts={posts} updatePost={updatePost}/>
          }
        })
      )
    }
    { (window==='Posts') && (
        posts.map((post) => {
          if (currentUser.role==='user' && post.user_id === currentUser.id){
            if (query && post.status === query){
              return <Post key={post.id} post={post} currentUser={currentUser} posts={posts} updatePost={updatePost}/>
            }
          }
          if (currentUser.role==='admin' || currentUser.role==='moderator'){
            if (query && post.status === query){
              return <Post key={post.id} post={post} currentUser={currentUser} posts={posts} updatePost={updatePost}/>
            }
          }
        })
      )
    }
    { (window==='Comments') && ((currentUser.role !== 'moderator')) &&
          comments.map((comment) => {
            if (currentUser.role==='user'){
              if (!comment.parent_comment_id && comment.user_id === currentUser.id){
                return <Comment key={comment.id} comment={comment} post={comment.post} currentUser={currentUser} />
              }
            }

            else if (currentUser.role==='admin'){
              if (!comment.parent_comment_id){
                return <Comment key={comment.id} comment={comment} post={comment.post} currentUser={currentUser} />
              }
            }
          })
    }
    { (window==='Likes') && (

        likes.map((like) => {
          if (currentUser.role==='user'){
            if (query && like[`${query}`]){
              if (query ==='post' && like.user_id === currentUser.id){
                return <Post key={like.post.id} post={like.post} currentUser={currentUser} posts={posts} updatePost={updatePost}/>
              }
              else if (query === 'comment' && like.user_id === currentUser.id){
                return <Comment key={like.comment.id} comment={like.comment} post={like.comment.post} currentUser={currentUser} />
              }
            }
          }

          if (currentUser.role==='admin'){
            if (query && like[`${query}`]){
              if (query==='post'){
                return <Post key={like.post.id} post={like.post} currentUser={currentUser} posts={posts} updatePost={updatePost}/>
              }
              else if (query==='comment'){
                return <Comment key={like.comment.id} comment={like.comment} post={like.comment.post} currentUser={currentUser} />
              }
            }
          }
        })
        )
    }
    { (window==='Reports') && (

        reports.map((report) => {
          if (currentUser.role==='user'){
            if (query && report[`${query}`]){
              if (query ==='post' && report.post.user_id === currentUser.id){
                return <Post key={report.post.id} post={report.post} currentUser={currentUser} posts={posts} updatePost={updatePost}/>
              }
              else if (query === 'comment' && report.comment.user_id === currentUser.id){
                return <Comment key={report.comment.id} comment={report.comment} post={report.comment.post} currentUser={currentUser} />
              }
            }
          }
          if (currentUser.role==='admin' || currentUser.role==='moderator'){
            if (query && report[`${query}`]){
              if (query==='post'){
                return <Post key={report.post.id} post={report.post} currentUser={currentUser} posts={posts} updatePost={updatePost}/>
              }
              else if (query==='comment'){
                return <Comment key={report.comment.id} comment={report.comment} post={report.comment.post} currentUser={currentUser} />
              }
            }
          }
        })
      )
    }

    {
      (currentUser.role==='user' && window === 'Suggestions') && (
        posts.map((post) => {
          if (post.status==='suggestion' && post.parent_post_id){
            return <Post key={post.id} post={post} currentUser={currentUser} posts={posts} updatePost={updatePost}/>
          }
        })
      )
    }

    {
      (currentUser.role==='admin' && window==='Community') && (
        users.map((user) => {
          return <User key={user.id} user={user} currentUser={currentUser} users={users}/>
        })
      )
    }

    { window==='Profile' && (
      <Profile currentUser={currentUser}/>
      )
    }
    </div>
  )
}

export default Feed
