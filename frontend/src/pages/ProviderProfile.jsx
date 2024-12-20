import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProviderContext } from '../context/ProviderContext';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { AppContext } from '../context/AppContext';
import { UserContext } from '../context/userContext';


const ProviderProfile = () => {
  const { providerId } = useParams();
  const { providers, providerData, setProviderData } = useContext(ProviderContext);
  const { posts } = useContext(AppContext);
  const {addToMyProvider,userData} = useContext(UserContext)

  const [providerPosts, setProviderPosts] = useState([]);

  const fetchProviderPosts = () => {
    const foundPosts = posts.filter((item) => item.providerData._id === providerId);
    setProviderPosts(foundPosts);
  };

  const fetchProviderData = () => {
    const foundProvider = providers.find((item) => item._id === providerId);
    setProviderData(foundProvider || null);
  };

  

  useEffect(() => {
    fetchProviderData();
    fetchProviderPosts();
  }, [providerId, providers, posts]);

  if (!providerData) {
    return <p>Loading...</p>; 
  }

 

  return (
    <div className='border-t border-mainColor min-h-[90vh] flex flex-col lg:flex-row items-start gap-12'>
      {/* ----- Provider Profile ------- */}
      <div className='mt-[60px] flex flex-col w-full sm:w-[350px]'>
        <div className='bg-white border p-8'>
          <div className='flex gap-4 items-center'>
            <img className='w-20 h-20 rounded-full' src={providerData.providerImage} alt="" />
            <div className='flex flex-col items-start'>
              <p className='font-semibold text-lg'>{providerData.providerName}</p>
              <p className='text-sm font-light py-0.5 px-2 border rounded-full'>{providerData.category}</p>
            </div>
          </div>
          <div className='mt-4'>
            <p className='font-medium'>Email</p>
            <p className='text-sm text-secondaryColor'>{providerData.providerEmail}</p>
          </div>
          <div className='mt-2'>
            <p className='font-medium'>Phone</p>
            <p className='text-sm text-secondaryColor'>{providerData.providerPhone}</p>
          </div>
          <div className='mt-2'>
            <p className='font-medium'>Bio</p>
            <p className='text-sm text-secondaryColor'>{providerData.providerBio}</p>
          </div>
          <div className='mt-2'>
            <p className='font-medium'>Address</p>
            <p className='text-sm text-secondaryColor'>{providerData.providerAddress.line1}</p>
            <p className='text-sm text-secondaryColor'>{providerData.providerAddress.line2}</p>
          </div>
          <div className='flex mt-2'>
            <button onClick={() => addToMyProvider(userData._id, providerId)}className='w-full text-center rounded bg-gray-700 text-white text-sm py-2 hover:opacity-85'>
              Add to My Providers
            </button>
          </div>
        </div>
      </div>

      {/* ---- Provider Works ------- */}
      <div className='lg:mt-[60px] bg-white p-4 flex-1 border overflow-y-scroll md:h-[80vh] w-full grid lg:grid-cols-2 mb-12 gap-4'>
        {providerPosts.map((item, index) => (
          <div key={index} className="p-4 border ">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderProfile;
