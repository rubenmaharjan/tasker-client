import React, { useState } from "react";
import { Button, ListGroup, ListGroupItem, Table } from "react-bootstrap";
import { Project } from "./Project.model";
import { ProjectModal } from "./ProjectModal";
import ProjectApi from "../../services/project.api";



export const ProjectList: React.FC<any> = ({refresh}) => {

    const [projects, setProjects] = useState<Project[]>([])
    const [showModal, setShowModal] = useState(false)
    const [project, setProject] = useState<Project>()

    React.useEffect(()=>{
        console.log("ProjectList UseEffect")
        refrestList()
    },[refresh])

    const refrestList = () => {
        Promise.all([ProjectApi.getAllProjects()]).then( response => {
            setProjects(response[0]?.data || [])
        }).catch(err => {
            console.log("Error fetching", err)
        });
    }
    const onArchive = (data:Project) => {
        data.active = !data.active
        console.log(data)
        Promise.all([ProjectApi.editProject(data)]).then( response => {
            console.log("Archived", response)
            refrestList()
        }).catch(err => {
            console.log("Editing Failed!")
        });
    }
    const onUnArchive = (data:Project) => {
        data.active = !data.active
        console.log(data)
        Promise.all([ProjectApi.editProject(data)]).then( response => {
            console.log("UnArchived", response)
            refrestList()
        });
    }

    const isActive = (currProject:Project) => {
        if (currProject.active){
            return <div>
                <Button onClick={()=> {setShowModal(true); setProject(currProject)}}>Edit</Button>
                <ProjectModal action="edit" showModal={showModal} setShowModal={setShowModal} project={project}/>
                <Button onClick={() => onArchive(currProject)}>Archive</Button>
            </div>
        }
        else {
            return <Button onClick={() => onUnArchive(currProject)}>Unarchive</Button>
        }
    }
    const renderList = (): JSX.Element[] => {
        return projects.map(project => {
            return (
                    <tr key={project.id} >
                        <td className={project.active ? "": "tdGray"}>{project.id}</td>
                        <td className={project.active ? "": "tdGray"}>{project.name}</td>
                        <td className={project.active ? "": "tdGray"}>{project.duration}</td>
                        <td className={project.active ? "": "tdGray"}>{project.duration_type}</td>
                        <td>
                            {isActive(project)}
                        </td>
                    </tr>
            )
        })
    }

    return projects.length <= 0 ? (<p style={{
        color: "grey",
        margin: "5vh",
    }}>No Projects</p>) : (
          <div className="tableDiv">
            <Table striped bordered hover >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Duration</th>
                        <th>Duration Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {renderList()}
                </tbody>
            </Table>
        </div>)
    
}
