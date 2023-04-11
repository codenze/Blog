import React, { useState } from 'react';
import { Avatar } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import "./css/Comment.css"
import SendIcon from '@mui/icons-material/Send';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CommentIcon from '@mui/icons-material/Comment';
import ReportIcon from '@mui/icons-material/Report';
import { useDispatch } from 'react-redux';
import { addReports } from './likeSlice';


function Comment({comment, post, newComment, currentUser, addComments, comments}) {
  const dispatch = useDispatch();

  const [commentLiked, setCommentLiked] = useState(false);
  const [replyLiked, setReplyLiked] = useState(false);
  const [commentReported, setCommentReported] = useState(false);
  const [replyReported, setReplyReported] = useState(false);



  const [showComments, setShowComments] = useState(false);




  const post_id = post.id;
  const parent_comment_id = comment ? comment.id : null;

  console.log(post_id, currentUser);
  const [showReply, setShowReply] = useState(false);

  const [replies, setReplies] = useState(comment ? comment.replies : []);

  const replyExist = replies && replies.length? true: false;

  const [value, setValue] = useState("");


  const reportComment = (e) => {

    setReplyReported(!replyReported);

    fetch(`https://weathered-firefly-2748.fly.dev/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      report: {
        user_id: currentUser.id,
        comment_id: comment.id,
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
      console.error('Error updating report:', error);
    });
  }


  const likeComment = (e) => {

    setCommentLiked(!commentLiked)

    fetch(`https://weathered-firefly-2748.fly.dev/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      like: {
        user_id: currentUser.id,
        comment_id: comment.id,
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
      console.error('Error updating like:', error);
    });
  }



  const reply = (e) => {

    if(value==""){
      return
    }

    const comment = {
      user_id: currentUser.id,
      post_id,
      body: value,
      status: 'approved',
      parent_comment_id
    };

    console.log('dasdfsadfasdf:', comment);
    fetch('https://weathered-firefly-2748.fly.dev/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        comment
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('New comment created:', data);
      if (parent_comment_id) {
        setReplies([...replies, data]);
      } else {
        addComments([...comments, data]);
      }
    })
    .catch(error => {
      console.error('Error creating comment:', error);
    });

    setValue("");
  }
  return (
    <div className='comment__main'>
      { !newComment? (
      <div className='comment__section'>
          <div className='comment'>
            <Avatar src={comment.user && comment.user.photo} />
            <div className='details'>
              <p>{comment.user && comment.user.name}</p>
              <span>{comment.body}</span>
            </div>
          </div>
          <div className='post__footer'>
            <div className={commentLiked ? 'post__footer_option liked': 'post__footer_option'}  onClick={likeComment} >
              <p>{commentLiked ? 'Liked' : 'Like'}</p>
            </div>
            <div className={!newComment ? 'post__footer_option': 'disable' } onClick={() => setShowReply(!showReply)} >
              <p>Reply</p>
            </div>
            <div className={commentReported ? 'post__footer_option liked': 'post__footer_option'}  onClick={reportComment} >
              <p>{commentReported ? 'Reported' : 'Report'}</p>
            </div>
          </div>
      </div>
      ) :
      (
      <div className='comment__section'>
        <div className='comment'>
          <Avatar src={currentUser.photo}/>
          <input
                type="text"
                placeholder='comment...'
                value={value}
                onChange={e => setValue(e.target.value)}
              />
          <div className='send' onClick={reply} >
            <SendIcon />
          </div>
        </div>
      </div>

      )
    }
      { (replyExist && showReply) && (
        replies.map((reply_comment) => {
          return (
            <div >
            <div className='reply'>
              <Avatar src={reply_comment.user.photo} />
              <div className='details'>
                <p>{reply_comment.user.name}</p>
                <span>{reply_comment.body}</span>
              </div>

            </div>

            <div className='comment__footer'>
            <div className={replyLiked ? 'comment__footer_option liked': 'comment__footer_option'}  onClick={() => setReplyLiked(!replyLiked)} >
              <p>{replyLiked ? 'Liked' : 'Like'}</p>
            </div>

            <div className={replyReported ? 'comment__footer_option liked': 'comment__footer_option'}  onClick={() => setReplyReported(!replyReported)} >
              <p>{replyReported ? 'Reported' : 'Report'}</p>
            </div>
          </div>

            </div>

          )
        })
      )}
      {(!newComment && showReply) && (
        <div className='reply'>
          <Avatar src={currentUser.photo}/>
          <input
                type="text"
                placeholder='reply...'
                value={value}
                onChange={e => setValue(e.target.value)}
              />
          <div className='send' onClick={reply} >
            <SendIcon />
          </div>
        </div>
      )}
    </div>

  )
}

export default Comment
