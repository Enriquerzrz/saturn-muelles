import React, { useState } from "react";
import { Tabs, Tab, Typography, Box, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { styled } from '@mui/material/styles';
import { tableCellClasses} from '@mui/material/TableCell';
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";


import "../styles/panel.scss";

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export default function Panel() {
    const [value, setValue] = useState(0);
    const [stateBarrier1, setStateBarrier1] = useState();
    const [stateBarrier2, setStateBarrier2] = useState();
	const [calendarEvents, setCalendarEvents] = useState([]);

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

	const download = () => {
		const element = document.createElement("a");
		const file = new Blob([JSON.stringify(calendarEvents)], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = "historico.txt";
		document.body.appendChild(element);
		element.click();
	};

    let getEvents = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };

        fetch('http://localhost:3002/events/view', requestOptions)
            .then(response => response.json())
            .then(response => {
				for (let i = 0; i < response.length; i++) {
					if (!rows.find(event => event.id === response[i].id)) {
						let endHour = parseInt(response[i].date.split(" ")[1].split(":")[0]) + 1;
						let title = "Matrícula: " + response[i].plate
						
						if (endHour < 10) {
							endHour = "0" + endHour;
						}

						let endDate = response[i].date.split(" ")[0] + " " + endHour + ":00";
						
						setRows(rows => [...rows, response[i]]);

						setCalendarEvents(calendarEvents => [...calendarEvents, { id: response[i].id, resourceId: response[i].dock - 1, title: title, start: response[i].date, end: endDate }]);
					}
				}
            })
            .catch(error => console.log(error));
    };

	getEvents();

	const [rows, setRows] = useState([
		{ id: 1, dock: 1, date: "2022-04-24 07:00", state: 1, type: 1, name: "Enrique", surname: "Ruiz", email: "enrique@gmail.com", telephone: 1234, dni: "1234", plate: "1234abc", role: 0 },
	])

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    let getBarrierData = async (name) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({
                name: name
            })
        };

        fetch('http://localhost:3002/barrier/get', requestOptions)
            .then(response => response.json())
            .then(response => {
                if (name === "barrera_1") {
                    setStateBarrier1(response[0].state === 2 ? true : false);
                } else {
                    setStateBarrier2(response[0].state === 2 ? true : false);
                }
            })
            .catch(error => console.log(error));
    };

    let setBarrierData = async (name, state) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({
                name: name,
                state: state
            })
        };

        fetch('http://localhost:3002/barrier/set', requestOptions)
            .then(response => response.json())
            .catch(error => console.log(error));
    };

    const barrierChange = (name) => {
        if (name === "1") {
            if (stateBarrier1 === false) {
                alert("Abriendo barrera de entrada");
                setBarrierData("barrera_1", 2);
            } else {
                alert("Cerrando barrera de entrada");
                setBarrierData("barrera_1", 1);
            }
        } else {
            if (stateBarrier2 === false) {
                alert("Abriendo barrera de salida");
                setBarrierData("barrera_2", 2);
            } else {
                alert("Cerrando barrera de salida");
                setBarrierData("barrera_2", 1);
            }
        }

        getBarrierData("barrera_1");
        getBarrierData("barrera_2");
    };

    const TabPanel = (props) => {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`vertical-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    const a11yProps = (index) => {
        return {
            id: `vertical-tab-${index}`,
            'aria-controls': `vertical-tabpanel-${index}`,
        };
    }

    getBarrierData("barrera_1");
    getBarrierData("barrera_2");

    return (
        <Box
            sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' , width: '100%'}}
        >
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                <Tab label="Control de Barreras" {...a11yProps(0)} />
                <Tab label="Visualización de Reservas" {...a11yProps(1)} />
                <Tab label="Histórico de reservas" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <div className="barrierControl">
                    <h1>Control de barreras</h1>
                    <p>Active los distintos botones para abrir o cerrar las barreras necesarias.</p>
                    <p>Tenga en cuenta que una vez activadas debe cerrarlas.</p>
                    <div className="barrier_1">
                        <h2>Barrera de entrada</h2>
                        <label>Cerrrada</label>
                        <Switch {...label} checked={stateBarrier1} onChange={() => barrierChange("1")} />
                        <label>Abierta</label>
                    </div>
                    <div className="barrier_2">
                        <h2>Barrera de salida</h2>
                        <label>Cerrrada</label>
                        <Switch {...label} checked={stateBarrier2} onChange={() => barrierChange("2")} />
                        <label>Abierta</label>
                    </div>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
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
				height="750px"
				slotDuration="00:15"
				editable={true}
				resourceAreaHeaderContent={'Muelles disponibles'}
				resources={muelles}
				events={calendarEvents}
				expandRows={true}
				nowIndicator={true}
			/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <div className="history">
                    <h1>Histórico de reservas</h1>
                    <Button variant="contained" onClick={()=>download()}>Guardar Histórico</Button>
                </div><TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>	
                                <StyledTableCell>ID Reserva</StyledTableCell>
                                <StyledTableCell align="right">Muelle</StyledTableCell>
                                <StyledTableCell align="right">Fecha</StyledTableCell>
                                <StyledTableCell align="right">Estado</StyledTableCell>
                                <StyledTableCell align="right">Tipo de vehículo</StyledTableCell>
                                <StyledTableCell align="right">Nombre</StyledTableCell>
                                <StyledTableCell align="right">Apellidos</StyledTableCell>
                                <StyledTableCell align="right">Email</StyledTableCell>
                                <StyledTableCell align="right">Teléfono</StyledTableCell>
                                <StyledTableCell align="right">DNI</StyledTableCell>
                                <StyledTableCell align="right">Matrícula</StyledTableCell>
                                <StyledTableCell align="right">Rol</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <StyledTableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <StyledTableCell component="th" scope="row">
                                        {row.id}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">{row.dock}</StyledTableCell>
                                    <StyledTableCell align="right">{row.date}</StyledTableCell>
                                    <StyledTableCell align="right">{row.state}</StyledTableCell>
                                    <StyledTableCell align="right">{row.type}</StyledTableCell>
                                    <StyledTableCell align="right">{row.name}</StyledTableCell>
                                    <StyledTableCell align="right">{row.surname}</StyledTableCell>
                                    <StyledTableCell align="right">{row.email}</StyledTableCell>
                                    <StyledTableCell align="right">{row.telephone}</StyledTableCell>
                                    <StyledTableCell align="right">{row.dni}</StyledTableCell>
                                    <StyledTableCell align="right">{row.plate}</StyledTableCell>
                                    <StyledTableCell align="right">{row.role}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>
        </Box>
    );
}
