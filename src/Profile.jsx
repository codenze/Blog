import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from './authSlice';
import './css/Profile.css'
function Profile(props) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(props.currentUser.name);
  const [email, setEmail] = useState(props.currentUser.email);
  const [role] = useState(props.currentUser.role);
  const [photoUrl, setPhotoUrl] = useState(props.currentUser.photo);

  function handleEditClick() {
    setEditing(true);
  }

  function handleSaveClick() {
    // save updated user information here

    fetch(`https://weathered-firefly-2748.fly.dev/users/${props.currentUser.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          name: name,
          email: email,
          photo: photoUrl
        }
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('User updated:', data);
        dispatch(setCurrentUser(data));

      })
      .catch(error => {
        console.error('Error updating post:', error);
      });


    setEditing(false);
  }

  function handleCancelClick() {
    // reset user information to original values
    setName(props.currentUser.name);
    setEmail(props.currentUser.email);
    setPhotoUrl(props.currentUser.photo);
    setEditing(false);
  }

  function handlePhotoChange(event) {
    setPhotoUrl(event.target.value);
  }

  return (
    <div className="profile">
      <div className="profile__details">
        <div className="profile__photo">
          <img src={photoUrl} alt="Profile" />
        </div>
        <div className="profile__info">
          {editing ? (
            <div className="profile__info-edit">
              <div className="info-detail">
              <label htmlFor="name">Profile:</label>
              <input type="text" placeholder="Enter image URL" value={photoUrl} onChange={handlePhotoChange} />
              </div>
              <div className='info-detail'>
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" value={name} onChange={(event) => setName(event.target.value)} />
              </div>
              <div className='info-detail'>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div className="profile__buttons">
                <button className="profile__button profile__button--save" onClick={handleSaveClick}>Save</button>
                <button className="profile__button profile__button--cancel" onClick={handleCancelClick}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="profile__info-display">
              <p className="profile__email">{role}</p>
              <h4 className="profile__name">{name}</h4>
              <p className="profile__email">{email}</p>
              <button className="profile__button profile__button--edit" onClick={handleEditClick}>Edit</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
