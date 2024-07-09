import React from 'react'
import { useState, useContext } from 'react';
import { ethers} from 'ethers';
import abi from '../utils/ContractABI.json';
import { ConnectionContext } from './ConnectionContext';
const CreateCampaign = () => {
  const { connected } = useContext(ConnectionContext);
  const [formState, setFormState] = useState({
    name: '',
    title: '',
    story: '',
    image: '',
    targetAmount: '',
    deadline: '',
 });

 const handleChange = (e) => {
  setFormState({
    ...formState,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = async(e) => {
  e.preventDefault();
  if (connected) {
    console.log(formState);
try{
    //calling contract method here
    const contractAddress =  "0xFc1a66401Bd08aED9cAC4e2aEC59DfD2A5c94CC4";
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, abi.abi,signer);
    console.log("instance is: ",contractInstance);
    console.log("owner name is: ",formState.name);
    console.log("title  is: ",formState.title);
    
    const tx = await contractInstance.createCampaign(
      formState.name,
      formState.title,
      formState.story,
      ethers.parseEther(formState.targetAmount),
      Math.floor(new Date(formState.deadline).getTime() / 1000),
      formState.image
    );
    
    const reciept = await tx.wait();
    console.log("campaign created: ",reciept);
    alert("Campaign created successfully!");
  }

    catch(error){
      console.error("error creating campaign",error);
    }

  } else {
    alert("Please connect wallet!");
  }
};
  return (
    <div className='home'>
      <h1 className='create-head'>Create campaign</h1>
      <form className='frm' onSubmit={handleSubmit}>
        <label className='frm-lbl'>
          Your name
          <input type="text" name="name" value={formState.name} onChange={handleChange}/>
        </label>
        <br />
        <label className='frm-lbl'>
          Title of campaign
          <input type="text" name="title" value={formState.title} onChange={handleChange}  />
        </label>
        <br />
        <label className='frm-lbl'>
          Story
          <textarea name="story" value={formState.story} onChange={handleChange} />
        </label>
        <br />
        <label className='frm-lbl'>
          Image URL
          <input type="text" name="image" value={formState.image} onChange={handleChange} />
        </label>
        <br />
        <label className='frm-lbl'>
          Target Amount (ETH)
          <input type="number" step="0.01" name="targetAmount" value={formState.targetAmount} onChange={handleChange}/>
        </label>
        <br />
        <label className='frm-lbl'>
          Deadline
          <input type="date" name="deadline" value={formState.deadline} onChange={handleChange} />
        </label>
        <br />
        <button className='sb-btn' type="submit">Create Campaign</button>
      </form>
    
    </div>
  )
}

export default CreateCampaign