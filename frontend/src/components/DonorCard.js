import React from 'react';

export default function DonorCard({ donor }) {
  return (
    <div className="card donor-card">
      <div className="card-row">
        <div className="avatar">{donor.name?.charAt(0)}</div>
        <div style={{flex:1}}>
          <h3 className="donor-name">{donor.name}</h3>
          <p className="muted">{donor.location} • Last donation: {donor.lastDonation || 'N/A'}</p>
        </div>
        <div className="blood-badge">{donor.bloodGroup}</div>
      </div>
      <div style={{marginTop:10}}><small>Contact: {donor.contact || '—'}</small></div>
    </div>
  );
}
