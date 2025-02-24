import React from "react";
import Avatar from "./ui/Avatar";
import { CiSettings } from "react-icons/ci";

const Profile = () => {
  return (
    <div className="w-full h-screen flex flex-col ">
      <div className="w-[400px] h-[400px] border-1 ">
        <div className="flex justify-center mt-5">
          <Avatar size="70px" />
          <div className="w-[300px] flex flex-col border-1">
            <div className="flex justify-between">
              <span>Username</span>
              <button>Edit Profile</button>
              <button>View Archieve</button>
              <button>
                <CiSettings />
              </button>
            </div>
          </div>
        </div>
          </div>
          <div></div>
    </div>
  );
};

export default Profile;
