import React, { useState } from "react";
import "../styles/ProfilePage.css";
import ProfilePic from "../assets/istockphoto-1309328823-612x612.jpg"; 
import Navbar from "./Navbar";
function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "mohammed khaled",
    email: "mkd@example.com",
    phone: "123-456-7890",
    weight: "75kg",
    height: "180cm",
    birthday: "2003-01-01",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div>
        <Navbar/>
    <div className="profile-container">
      {/* Left Box */}
      <div className="profile-left">
        <img src={ProfilePic} alt="Profile" className="profile-pic" />
        <h2>{profile.name}</h2>
        <hr/>
        <p>Email: {profile.email}</p>
        <hr/>
        <p>Phone: {profile.phone}</p>
      </div>

      {/* Right Box */}
      <div className="profile-right">
        <h2 className="black">Edit Profile</h2>
        <form className="profile-form">
          <label>
            Name:
            <input type="text" name="name" value={profile.name} onChange={handleChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={profile.email} onChange={handleChange} />
          </label>
          <label>
            Phone:
            <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
          </label>
          <label>
            Weight:
            <input type="text" name="weight" value={profile.weight} onChange={handleChange} />
          </label>
          <label>
            Height:
            <input type="text" name="height" value={profile.height} onChange={handleChange} />
          </label>
          <label>
            Birthday:
            <input type="date" name="birthday" value={profile.birthday} onChange={handleChange} />
          </label>
        </form>
      </div>
    </div>
    </div>
  );
}

export default ProfilePage;
