import React, { useState } from 'react';
import { Avatar } from '@mui/material'
import "../../css/Comment.css"
import SendIcon from '@mui/icons-material/Send';
import { useDispatch } from 'react-redux';
import { addReports } from '../../slices/likeSlice';
import { setReload } from '../../slices/authSlice';
import { useSelector } from 'react-redux';
import timeDiff from '../../time';


function Reply({reply_comment, newComment, currentUser, parent_comment_id, post_id, addReplies, replies}) {
  const dispatch = useDispatch();

  const comment_id = reply_comment ? reply_comment.id : null;
  const likes = useSelector(state => state.like.likes);
  const comment_like = likes.find(like => like.user_id === currentUser.id && like.comment_id === comment_id);
  const isLiked = comment_like && comment_like.status === 'active' ? true : false;
  const [replyLiked, setReplyLiked] = useState(isLiked);

  const reports = useSelector(state => state.like.reports);
  const comment_report = reports.find(report => report.user_id === currentUser.id && report.comment_id === comment_id);
  const isReported = comment_report && comment_report.status === 'active' ? true : false;
  const [replyReported, setReplyReported] = useState(isReported);

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
        comment_id: reply_comment.id,
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

    setReplyLiked(!replyLiked)

    fetch(`https://weathered-firefly-2748.fly.dev/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      like: {
        user_id: currentUser.id,
        comment_id: reply_comment.id,
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
    fetch(`https://weathered-firefly-2748.fly.dev/comments/${comment_id}`, {
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
      addReplies([...replies, data]);
    })
    .catch(error => {
      console.error('Error creating comment:', error);
    });

    setValue("");
  }

  return (
    <div >
    {reply_comment && (<div>
        <div className='reply'>
          <Avatar src={reply_comment.user.photo} />
          <div className='details'>
            <p>{reply_comment.user.name}</p>
            <div className='time'><small>{timeDiff(reply_comment.updated_at)}</small></div>
            <span>{reply_comment.body}</span>
          </div>
        </div>
        { currentUser.role === 'user' ? (
        <div className='comment__footer'>
          <div className={replyLiked ? 'comment__footer_option liked': 'comment__footer_option'}  onClick={likeComment} >
            <p>{replyLiked ? 'Liked' : 'Like'}</p>
          </div>

          <div className={replyReported ? 'comment__footer_option liked': 'comment__footer_option'}  onClick={reportComment} >
            <p>{replyReported ? 'Reported' : 'Report'}</p>
          </div>
        </div>
        ) : (
        <div className='comment__footer'>
        <div className={replyLiked ? 'comment__footer_option liked': 'comment__footer_option'}  onClick={() => handleComment(true)} >
          <p>{(reply_comment.status === 'approved') ? 'Approved' : 'Approve'}</p>
        </div>

        <div className={replyReported ? 'comment__footer_option liked': 'comment__footer_option'}  onClick={() => handleComment(false)} >
          <p>{(reply_comment.status === 'reject') ? 'Removed' : 'Remove'}</p>
        </div>
      </div>)
        }
      </div>
      )
    }
      {(newComment && currentUser.role === 'user') && (
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

export default Reply
