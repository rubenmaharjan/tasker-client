import React, { useState } from 'react';
import './App.css';
import './components/project/Project.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ProjectList, ProjectModal} from "./components/index";
import { Button } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css"
import { Link } from "react-router-dom";

function App() {

  const [showModal, setShowModal] = useState(false)
  const [refresh, setRefresh] = useState(false)

  React.useEffect(() => {
    setRefresh(!refresh)
    console.log("Refresh")
  }, [showModal])

  return (
    <div className="App">
      <header className="App-header">
        <h1>Projects</h1>
        <Button variant="primary" onClick={( )=> setShowModal(true)}>Create Project</Button>
        <ProjectModal action='create' showModal={showModal} setShowModal={setShowModal} />
        <ProjectList refresh={refresh}/>
      </header>
    </div>
  );
}

export default App;
