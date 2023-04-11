import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';
import ErrorModal from './ErrorModal';

function RouteChecker() {
  const [stopNumber, setStopNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [busSchedule, setBusSchedule] = useState([]);
  const [showError, setShowError] = useState(false);

  const toggleError = () => setShowError(!showError);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedDate === '') {
      toggleError();
      return;
    }
    axios.get(`https://api.translink.ca/rttiapi/v1/stops/${stopNumber}/estimates?apikey=1HNL93HFg1afzV7c8J9v&count=3&timeframe=1440&date=${selectedDate}`)
      .then(response => {
        const filteredSchedule = response.data.map(bus => {
          const filteredSchedules = bus.Schedules.filter(schedule => {
            const startTime = new Date(schedule.ExpectedLeaveTime).getTime();
            const selectedTime = new Date(selectedDate).getTime();
            return startTime >= selectedTime;
          });
          return { ...bus, Schedules: filteredSchedules };
        });
        setBusSchedule(filteredSchedule);
        setShowError(false);
      })
      .catch(error => console.log(error));
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          height: "100%"
        }}
        >
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center"
          }}          
          className="mb-2"
        >
          Enter bus stop number:
          <input type="text" value={stopNumber} onChange={e => setStopNumber(e.target.value)} className="mb-3"
/>
        </label>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center"
          }}
          className="mb-2"
        >
          Select date:
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="mb-3"/>
        </label>
        <button type="submit" className="mt-3 mb-3" >Search</button>
      </form>
      <ul>
        {busSchedule.map(bus => (
          <li key={bus.RouteNo}>
            <p>Route: {bus.RouteNo}</p>
            <ul>
              {bus.Schedules.map(schedule => (
                <li key={schedule.ExpectedLeaveTime}>{schedule.ExpectedLeaveTime}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <ErrorModal isOpen={showError} toggle={toggleError} />
    </div>
  );
}


export default RouteChecker;
