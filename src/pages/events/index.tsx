import React from 'react';
import { useNavigate } from 'react-router-dom';
const Events = () => {
  const navigate = useNavigate();
  return (
    <>
    <div>Events</div>
    <button onClick={() => navigate('/event/create')}>Create New Event</button>
    </>
  )
}

export default Events