import React, { useState } from 'react';
import { Avatar } from '@mui/material'
import "../../css/Comment.css"
import SendIcon from '@mui/icons-material/Send';
import { useDispatch } from 'react-redux';
import { addReports } from '../../slices/likeSlice';
import { setReload } from '../../slices/authSlice';
import { useSelector } from 'react-redux';
import Reply from './Reply';
import timeDiff from '../../time'

function Comment({comment, post, newComment, currentUser, addComments, comments, feed}) {
  const dispatch = useDispatch();

  const check = comment && comment.parent_comment_id;
  const comment_id = comment ? comment.id : null;
  const likes = useSelector(state => state.like.likes);
  const comment_like = likes.find(like => like.user_id === currentUser.id && like.comment_id === comment_id);
  const isLiked = comment_like && comment_like.status === 'active' ? true : false;
  const [commentLiked, setCommentLiked] = useState(isLiked);

  const reports = useSelector(state => state.like.reports);
  const comment_report = reports.find(report => report.user_id === currentUser.id && report.comment_id === comment_id);
  const isReported = comment_report && comment_report.status === 'active' ? true : false;
  const [commentReported, setCommentReported] = useState(isReported);

  const post_id = post.id;
  const parent_comment_id = comment ? comment.id : null;

  const [showReply, setShowReply] = useState(false);

  const [replies, setReplies] = useState(comment ? comment.replies : []);

  const replyExist = replies && replies.length? true: false;

  const [value, setValue] = useState("");

  const addReplies = (newReplies) =>{
    setReplies(newReplies);
  }

  const reportComment = (e) => {

    setCommentReported(!commentReported);

    fetch(`http://localhost:3000/reports`, {
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
      dispatch(addReports(data));
      dispatch(setReload('report'));
    })
    .catch(error => {
      console.error('Error updating report:', error);
    });

  }


  const likeComment = (e) => {

    setCommentLiked(!commentLiked)

    fetch(`http://localhost:3000/likes`, {
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
      dispatch(addReports(data));
      dispatch(setReload('like'));
    })
    .catch(error => {
      console.error('Error updating like:', error);
    });

  }


  const handleComment = (s) => {
    const status = s ? 'approved' : 'reject';
    fetch(`http://localhost:3000/comments/${comment.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      comment: {
        status: status
      }
    })
    })
    .then(response => response.json())
    .then(data => {
      addReplies(replies.map(reply =>
        reply.id === data.id ? { ...reply, ...data } : reply
      ));
      dispatch(setReload('comment'));
    })
    .catch(error => {
      console.error('Error updating post:', error);
    });
  }





  const reply = (e) => {

    if(value === ""){
      return
    }

    const comment = {
      user_id: currentUser.id,
      post_id,
      body: value,
      status: 'approved',
      parent_comment_id
    };

    fetch('http://localhost:3000/comments', {
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
      <div className= {!check ? 'comment__section' : 'comment__section __reply'}>
          <div className='comment'>
            <Avatar src={comment.user && comment.user.photo} />
            <div className='details'>
              <p>{comment.user && comment.user.name}</p>
              <div className='time'><small>{timeDiff(comment.updated_at)}</small></div>
              <span>{comment.body}</span>
            </div>
          </div>
          { (currentUser.role === 'user' ? (
          <div className='post__footer'>
            <div className={commentLiked ? 'post__footer_option liked': 'post__footer_option'}  onClick={likeComment} >
              <p>{commentLiked ? 'Liked' : 'Like'}</p>
            </div>
            { !comment.parent_comment_id && (
              <div className={!newComment ? 'post__footer_option': 'disable' } onClick={() => setShowReply(!showReply)} >
                <p>Reply</p>
              </div>
              )
            }
            <div className={commentReported ? 'post__footer_option liked': 'post__footer_option'}  onClick={reportComment} >
              <p>{commentReported ? 'Reported' : 'Report'}</p>
            </div>
          </div>
          ) : (

          <div className='post__footer'>
            <div className={commentLiked ? 'post__footer_option liked': 'post__footer_option'}  onClick={() => handleComment(true)} >
              <p>{(comment.status === 'approved') ? 'Approved' : 'Approve'}</p>
            </div>
            { !comment.parent_comment_id && (
              <div className={!newComment ? 'post__footer_option': 'disable' } onClick={() => setShowReply(!showReply)} >
                <p>Replies</p>
              </div>
              )
            }
            <div className={commentReported ? 'post__footer_option liked': 'post__footer_option'}  onClick={() => handleComment(false)} >
              <p>{(comment.status === 'reject') ? 'Removed' : 'Remove'}</p>
            </div>
          </div>
          )
          )
          }
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
          return ( <Reply reply_comment={reply_comment} currentUser={currentUser} parent_comment_id={parent_comment_id} post_id={post_id} addReplies={addReplies} replies={replies}/>
          )
        })
      )}
      {(!newComment && showReply) && (
         <Reply newComment={true} currentUser={currentUser} parent_comment_id={parent_comment_id} post_id={post_id} addReplies={addReplies} replies={replies}/>
      )
    }
    </div>

  )
}

export default Comment
