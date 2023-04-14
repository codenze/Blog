import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import { Avatar } from '@mui/material'
import { setReload } from '../../slices/authSlice';
import { useDispatch } from 'react-redux';

function Sugesstion({ children, onCancel, initialValue, currentUser, updatePost, posts }) {
  const dispatch = useDispatch();
  const [value, setValue] = useState(initialValue.content);
  const isSuggestion = (initialValue.parent_post_id) ? true : false;
  const submitPost = () => {
      if(value === ""){
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
        dispatch(setReload('post'));
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

export default Sugesstion
