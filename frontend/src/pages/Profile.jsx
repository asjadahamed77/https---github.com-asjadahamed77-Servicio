import React, { useContext, useEffect, useState } from "react";
import { ProviderContext } from "../context/ProviderContext";
import { PiUploadSimpleBold } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

const Profile = () => {
  
  const {
    providerData,
    setProviderData,
    providerToken,
    getProviderProfileData,
  } = useContext(ProviderContext);
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [editable, setEditable] = useState(false);
  const [providerImage, setProviderImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [providerPosts, setProviderPosts] = useState([]);

  const fetchProvidersPosts = async()=>{
    try {
      const {data} = await axios.get(backendUrl+'/api/provider/list-provider-posts',{headers:{providerToken}})
    if(data.success){
      setProviderPosts(data.providerPost)
    }
    else{
      toast.error(data.message)
    }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const deletePost = async(postId)=>{
    try {
      const {data} = await axios.post(backendUrl+'/api/provider/delete-post',{postId},{headers:{providerToken}})
      if(data.success){
        toast.success("Post Deleted Successfully")
        fetchProvidersPosts()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchProvidersPosts()
  },[providerPosts,providerToken])

  

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProviderImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const updateHandler = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("providerName", providerData.providerName);
      formData.append("providerPhone", providerData.providerPhone);
      formData.append("providerBio", providerData.providerBio);
      formData.append(
        "providerAddress",
        JSON.stringify(providerData.providerAddress || {})
      );
      if (imageFile) {
        formData.append("providerImage", imageFile);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/provider/update-profile`,
        formData,
        {
          headers: { providerToken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await getProviderProfileData();
        setEditable(false);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  

  return loading ? (
    <div className="flex justify-center items-center min-h-screen">
      <BeatLoader color="#212121" size={25} />
    </div>
  ) : (
    providerData && (
      <div className="border-t border-mainColor min-h-[90vh] flex flex-col sm:flex-row items-start gap-12">
        {/* ----- Provider Profile ------- */}
        <div className="mt-[60px] flex flex-col w-full  sm:w-[350px]">
          <div className="bg-white border p-8">
            <div className="flex gap-4 items-center">
              {editable ? (
                <label htmlFor="image">
                  <img
                    className="w-20 h-20 rounded-full"
                    src={providerImage || providerData.providerImage}
                    alt=""
                  />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImage}
                    id="image"
                  />
                </label>
              ) : (
                <img
                  className="w-20 h-20 rounded-full"
                  src={providerData.providerImage}
                  alt=""
                />
              )}
              <div className="flex flex-col items-start">
                {editable ? (
                  <input
                    type="text"
                    placeholder="Change here"
                    value={providerData.providerName}
                    onChange={(e) =>
                      setProviderData((prev) => ({
                        ...prev,
                        providerName: e.target.value,
                      }))
                    }
                    className="w-full p-1 border rounded-md mb-1"
                  />
                ) : (
                  <p className="font-semibold text-lg">
                    {providerData.providerName}
                  </p>
                )}
                <p className="text-sm font-light py-0.5 px-2 border rounded-full">
                  {providerData.category}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-medium">Email</p>
              <p className="text-sm text-secondaryColor">
                {providerData.providerEmail}
              </p>
            </div>
            <div className="mt-2">
              <p className="font-medium">Phone</p>
              {editable ? (
                <input
                  type="number"
                  placeholder="Change your phone"
                  value={providerData.providerPhone}
                  onChange={(e) =>
                    setProviderData((prev) => ({
                      ...prev,
                      providerPhone: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border text-sm p-1"
                />
              ) : (
                <p className="text-sm text-secondaryColor">
                  {providerData.providerPhone}
                </p>
              )}
            </div>

            <div className="mt-2">
              <p className="font-medium">Bio</p>
              {editable ? (
                <textarea
                  className="resize-none w-full border rounded-md overflow-y-scroll h-20 p-1 text-sm"
                  value={providerData.providerBio}
                  onChange={(e) =>
                    setProviderData((prev) => ({
                      ...prev,
                      providerBio: e.target.value,
                    }))
                  }
                  placeholder="Type here... "
                ></textarea>
              ) : (
                <p className="text-sm text-secondaryColor">
                  {providerData.providerBio}
                </p>
              )}
            </div>
            {/* Address */}
            <div className="mt-2">
              <p className="font-medium">Address</p>
              {editable ? (
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="Street"
                    value={providerData.providerAddress?.line1 || ""}
                    onChange={(e) =>
                      setProviderData((prev) => ({
                        ...prev,
                        providerAddress: {
                          ...prev.providerAddress,
                          line1: e.target.value,
                        },
                      }))
                    }
                    className="w-full rounded-md border text-sm p-1"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={providerData.providerAddress?.line2 || ""}
                    onChange={(e) =>
                      setProviderData((prev) => ({
                        ...prev,
                        providerAddress: {
                          ...prev.providerAddress,
                          line2: e.target.value,
                        },
                      }))
                    }
                    className="w-full rounded-md border text-sm p-1"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-secondaryColor">
                    {providerData.providerAddress?.line1}
                  </p>
                  <p className="text-sm text-secondaryColor">
                    {providerData.providerAddress?.line2}
                  </p>
                </div>
              )}
            </div>
            <div className="flex mt-2">
              {editable ? (
                <button
                  onClick={updateHandler}
                  className="w-full text-center rounded bg-blue-700 text-white text-sm py-2 hover:opacity-85"
                >
                  Save Profile
                </button>
              ) : (
                <button
                  onClick={() => setEditable(true)}
                  className="w-full text-center rounded bg-gray-700 text-white text-sm py-2 hover:opacity-85"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          {/* --- Upload Recent Work */}
          <div
            onClick={() => {
              navigate("/add-service");
              window.scrollTo(0, 0);
            }}
            className="cursor-pointer border text-center bg-white mt-8 py-4 hover:bg-mainColor hover:text-white duration-300 transition-all  flex items-center justify-center gap-2"
          >
            <PiUploadSimpleBold className="text-lg" />
            UPLOAD A NEW SERVICE
          </div>
        </div>
        {/* ---- User Works ------- */}
        <div className="mt-[60px] bg-white mb-12 p-4 flex-1 border overflow-y-scroll min-h-[80vh] w-full">
        <p className="font-medium ">My Profile</p>
        <div className='mt-4 bg-white p-4 flex-1 border overflow-y-scroll  w-full grid lg:grid-cols-2 mb-12 gap-4'>
        {providerPosts.map((item, index) => (
          <div key={index} className="p-4 border min-h-[400px]">
            <div className="flex gap-2 items-center cursor-pointer">
              <img className="w-16 h-16 rounded-full" src={item.providerData.providerImage} alt="user" />
              <div>
                <p className="font-semibold">{item.providerData.providerName}</p>
                <p className="text-sm text-secondaryColor">{item.providerData.category}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-600 italic mt-1">{item.postDescription}</p>
              <div className='flex items-center justify-center mt-1'>
                <div>
                  <FaAngleLeft className='bg-slate-100 text-2xl cursor-pointer hover:text-white hover:bg-mainColor transition-all duration-150 p-1 rounded-full border mr-1' />
                </div>
                {item.postImages && <img className="mt-2 w-[90%]  h-[300px] object-cover " src={item.postImages[0]} alt="" />}
                <div>
                  <FaAngleRight className='bg-slate-100 text-2xl cursor-pointer hover:text-white hover:bg-mainColor transition-all duration-150 p-1 rounded-full border ml-1' />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-2 text-gray-600 text-sm">
              <p>{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              |
              <p>{new Date(item.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
            </div>
            <div onClick={()=>deletePost(item._id)} className="flex justify-center w-full py-3 border border-red-500 rounded mt-2 cursor-pointer text-red-500 hover:bg-red-400 hover:text-white">
              Delete Post
            </div>
          </div>
          
        ))}
      </div>
        </div>
      </div>
    )
  );
};

export default Profile;
