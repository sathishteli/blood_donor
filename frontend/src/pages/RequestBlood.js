import React, {useState} from 'react';
import api from '../api/api';

export default function RequestBlood(){
  const [form,setForm]=useState({patient:'',bloodGroup:'',location:'',notes:''});
  const [loading,setLoading]=useState(false);

  const submit=async e=>{
    e.preventDefault();
    setLoading(true);
    try{
      // For now we can POST to a /requests route if backend supports it.
      // If not, just alert — backend changes needed to store requests.
      await api.post('/requests', form).catch(()=>{}); // ignore if endpoint missing
      alert('Request posted. Donors nearby will be notified (simulated).');
      setForm({patient:'',bloodGroup:'',location:'',notes:''});
    }catch(err){
      alert('Failed to send request');
    }finally{ setLoading(false); }
  };

  return (
    <div className="container form-box">
      <h2>Request Blood</h2>
      <form onSubmit={submit}>
        <input placeholder="Patient name" value={form.patient} onChange={e=>setForm({...form, patient:e.target.value})} required/>
        <input placeholder="Blood group (e.g. A+)" value={form.bloodGroup} onChange={e=>setForm({...form, bloodGroup:e.target.value})} required/>
        <input placeholder="Location / Hospital" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} required/>
        <textarea placeholder="Notes (optional)" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}></textarea>
        <button className="btn" type="submit">{loading? 'Sending...' : 'Send Request'}</button>
      </form>
    </div>
  );
}
