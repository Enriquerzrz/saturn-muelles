import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { AddCircle } from '@mui/icons-material'; // https://mui.com/material-ui/material-icons/

import "../styles/home.scss";

// https://fullcalendar.io/docs/timegrid-view
// https://fullcalendar.io/docs
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";

export default function Home(props) {
  const { user, userLogged } = props;

  const navigate = useNavigate();

  const [addFormVisible, setAddFormVisible] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [eventHour , setEventHour] = useState("06:00");
  const [eventDock, setEventDock] = useState(-1);

  const muelles = [
    {id: 0, title: 'Muelle 1', type: 1},
    {id: 1, title: 'Muelle 2', type: 1},
    {id: 2, title: 'Muelle 3', type: 1},
    {id: 3, title: 'Muelle 4', type: 2},
    {id: 4, title: 'Muelle 5', type: 2},
    {id: 5, title: 'Muelle 6', type: 2},
    {id: 6, title: 'Muelle 7', type: 3},
    {id: 7, title: 'Muelle 8', type: 3},
    {id: 8, title: 'Muelle 9', type: 3},
    {id: 9, title: 'Muelle 10', type: 3},
  ];

  const [calendarEvents, setCalendarEvents] = useState([
    // { title: 'event 1', date: '2022-04-20 13:30' },
    // { title: "today's event", date: new Date(1650637267000) },
    // starts at '2022-04-20 13:30' ends at '2022-04-20 14:30'
    // { title: 'event 2', start: '2022-04-20 13:30', end: '2022-04-20 15:30' },
    // {resourceId: 1, title: 'event 1', start: '2022-04-24 07:30', end: '2022-04-24 09:30'},
  ]);

  useEffect(() => {
    if (!userLogged) {
      navigate("/login");
    } else {
      if (calendarEvents.length === 0) {
        getEvents();
      }
    }
  }, [userLogged]);

  let addEventServer = async() => { 
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        
        body: JSON.stringify({
          dni: user.dni,
          plate: user.plate,
          date: eventDate + " " + eventHour,
          dock: eventDock,
          type: user.type
        })
    };

    fetch('http://localhost:3002/events/create', requestOptions)
      .then(response => response.json())
      .catch(error => console.log(error));
  };

  let getEvents = () => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };

    fetch('http://localhost:3002/events/view', requestOptions)
      .then(response => response.json())
      .then(response => {
        for (let i = 0; i < response.length; i++) {
          if (!calendarEvents.find(event => event.start === response[i].date) && (response[i].state === 1)) {
            // end one hour after
            let endHour = parseInt(response[i].date.split(" ")[1].split(":")[0]) + 1;
            
            if (endHour < 10) {
              endHour = "0" + endHour;
            }

            let endDate = response[i].date.split(" ")[0] + " " + endHour + ":00";
            let editable = false;
            let title = "";
            let color = ""

            if ((user.role === 1) || (user.dni === response[i].dni)) {
              editable = true;
              title = "Matrícula: " + response[i].plate
              color = "#132238";
            } else {
              title = "Reservado"
              color = "#ff4c4c";
            }

            setCalendarEvents(calendarEvents => [...calendarEvents, { id: response[i].id, resourceId: response[i].dock - 1, color: color, modify: editable, title: title, start: response[i].date, end: endDate }]);
          }
        }
      })
      .catch(error => console.log(error));
  };

  let deleteEvent = async(id) => { 
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        
        body: JSON.stringify({
          id: id
        })
    };

    fetch('http://localhost:3002/events/delete', requestOptions)
      .then(response => response.json())
      .catch(error => console.log(error));
  };

  const addEvent = () => {
    if (eventDate !== "" && eventDock !== -1) {
      addEventServer();

      getEvents();
      
      setAddFormVisible(false);
    } else {
      alert("El evento contiene algunos errores");
    }
    
    setEventDate("");
    setEventHour("06:00");
  };

  const addForm = () => {
    return (
      <form className="addForm">
        <h1>Hacer reserva</h1>
        <div className="rowForm">
          <span>Día:</span>
          <input type="date" required onChange={(e) => setEventDate(e.target.value)} />
        </div>
        <div className="rowForm">
          <span>Hora:</span>
          <select required  onChange={(e) => setEventHour(e.target.value)}>
            <option selected value="06:00">06:00</option>
            <option value="07:00">07:00</option>
            <option value="08:00">08:00</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="12:00">12:00</option>
            <option value="13:00">13:00</option>
          </select>
        </div>
        <div className="rowForm">
          <span>Muelle:</span>
          <select required onChange={(e) => setEventDock(parseInt(e.target.value) + 1)}>
            {muelles.map(muelle => (
              <option key={muelle.id} value={muelle.id} disabled={(user.type !== muelle.type) && !(user.role === 1)}>{muelle.title}</option>
            ))}
          </select>
        </div>
        <div className="confirmButton" onClick={() => addEvent()}>Confirmar reserva</div>
        <div className="cancelButton" onClick={() => setAddFormVisible(false)}>Cancelar reserva</div>
      </form>
    );
  };

  return (
    <div className="App">
      <FullCalendar
        timeZone="Europe/Madrid"
        defaultView="resourceTimeline"
        plugins={[resourceTimelinePlugin]}
        headerToolbar={{
          left: "today prev,next",
          center: "title",
          right: "resourceTimeline"
        }}
        scrollTime="06:00"
        views={{
          resourceTimeline: {
            buttonText: 'Ver muelles disponibles',
            slotDuration: '00:15'
          }
        }}
        slotDuration="00:15"
        editable={true}
        resourceAreaHeaderContent={'Muelles disponibles'}
        resources={muelles}
        expandRows={true}
        aspectRatio={2}
        nowIndicator={true}
        events={calendarEvents}
        // resources='https://fullcalendar.io/api/demo-feeds/resources.json?with-nesting&with-colors'
        // events='https://fullcalendar.io/api/demo-feeds/events.json?single-day&for-resource-timeline'
        eventClick={(info) => {
          if (info.event.extendedProps.modify === true) {
            if (window.confirm("Va usted a eleminar una reserva...")) {
              if (window.confirm("¿Está seguro de que desea eliminar la reserva?")) {
                let events = [...calendarEvents];
                events = events.filter(event => event.id !== parseInt(info.event.id));
                console.log(events)
                setCalendarEvents(events);
                deleteEvent(info.event.id);
              }else{
                return;
              }
            }else{
              return;
            }
          }
        }}
      />

      {addFormVisible && addForm()}

      <div className="addButton" onClick={() => setAddFormVisible(!addFormVisible)}>
        <AddCircle />
      </div>
    </div>
  );
}
