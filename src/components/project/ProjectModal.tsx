import React, { useState } from "react";
import {Alert, Button, Form, Modal, Toast, Container, Row, Col, InputGroup} from "react-bootstrap"
import { Project, DeliverableList, Deliverable } from "./Project.model";
import DatePicker from "react-datepicker";
import moment from "moment";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import ProjectApi from "../../services/project.api";
import Select from 'react-select'


export interface IProps {
    action: string
    showModal: boolean
    setShowModal: any
    project?: Project
}

export const ProjectModal: React.FC<IProps> = ({action, showModal, setShowModal, project}) => {

    const { register, handleSubmit, control, formState: { errors }, setValue , reset} = useForm({
    });
    const [showAlert, setShowAlert] = useState(false)
    const [success, setSuccess] = useState(false)
    const [showWBSModal, setShowWBSModal] = useState(false)
    const [alsertMsg, setAlertMsg] = useState('')

    const options = [
        { value: "days", label: "Days" },
        { value: "weeks", label: "Weeks" },
        { value: "months", label: "Vanilla" }
    ]

  const [deliverables, setDeliverables] = useState<Deliverable[]>([{deliverable:'', sub_deliverables:[{sub_deliverable:''}]}])

    const addDeliverables = () => {
      setDeliverables([...(deliverables), {deliverable: ""}])
    }

    const addSubdeliverables =  (i:number) => {
     let values = [...deliverables]
      if (values[i].sub_deliverables)
        values[i].sub_deliverables?.push({sub_deliverable:''})
      else
        values[i].sub_deliverables = [{sub_deliverable:''}]
      setDeliverables(values)
    }

    const onSubmitWBS = (e:any) => {
      console.log("WBS", deliverables);
      if (project){
        let data:DeliverableList ={project_id: project.id, deliverables:deliverables}
        console.log("Project", project, data)
          project.deliverables = deliverables
          ProjectApi.editProject(project).then(response => {
            console.log("WOW",response)
          }).catch(err =>{
            console.log("Error",err)
          })
      }
      else{
          console.log("First Create A Project")
      }
    }

  const handleDeliverableChange = (index:any, event: any) => {
    console.log(event.target.value)
     let values = [...deliverables]
      values[index].deliverable = event.target.value;
      setDeliverables(values)
  }

  const handleSubdeliverableChange = (index:any, subindex:any, event: any) => {
    console.log(event.target.value)
     let values = [...deliverables]
      values![index].sub_deliverables![subindex].sub_deliverable = event.target.value;
      setDeliverables(values)
  }


    React.useEffect(() => {
        if(showModal){
            if(project){
              console.log("PROJE",project)
                setValue( "name", project.name );
                setValue( "duration", project.duration );
                setValue( "duration_type", options.filter(option => option.value === project.duration_type) );
                setValue("start_date", moment(project?.start_date).toDate())
                setDeliverables(project.deliverables)
            }
        }
    }, [showModal])

    const onSubmit = (data: any) => {
        console.log(data)
        data.id = project?.id
        data.start_date = moment(data?.start_date).format("YYYY-MM-DD")
        data.duration_type = data?.duration_type?.value || options[0].value
        console.log(data)
        if(action == 'create'){
            ProjectApi.createProject(data).then(response => {
                console.log("Created Project", response)
                setSuccess(true) 
                setAlertMsg("Project was Created!")
            }).catch(err => {
                setSuccess(false)
                setAlertMsg("Project was not Created!")
                console.log(err.message)
            })
            setShowAlert(true)
        }
        else {
            ProjectApi.editProject(data).then(response => {
                console.log("Created Project", response)
                setSuccess(true)
                setAlertMsg("Project was Edited!")
            }).catch(err => {
                setSuccess(false)
                setAlertMsg("Project was not Edited!")
            })
            setShowAlert(true)
        }
        reset();
        setShowModal(false);
    }

    return (
      <div>
        <Modal size="lg" fullscreen={true} show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <div className="d-flex justify-content-center">
                        <Modal.Title>{action === 'create'? "Create": "Edit"} Project</Modal.Title>
                    </div>
                </Modal.Header>
      <Modal.Body>
      <Container>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col>
                    {/* register your input into the hook by invoking the "register" function */}
                    <label>Project Name <span>*</span></label>
                    <input {...register("name", {required: true})} />
                    {errors.name && <span>This field is required</span>}
                    <label>Start Date <span>*</span></label>
                    <Controller
                        control={control}
                        name='start_date'
                        render={({ field }) => (
                            <DatePicker
                                placeholderText='Select date'
                                onChange={(date) => field.onChange(date)}
                                selected={field.value || moment().toDate()}
                            />
                        )}
                    />
                    <label>Duration <span>*</span></label>
                    <input type="number" {...register("duration", {required: true, valueAsNumber: true})} />
                    {errors.name && <span>This field is required</span>}
                    <label>Duration Type <span>*</span></label>
                    {/* <input {...register("duration_type", {required: true})} /> */}
                    <Controller
                        name="duration_type"
                        control={control}
                        render={({ field }) => <Select
                            {...field}
                            defaultValue={options[0]}
                            onChange = {value => {field.onChange(value); console.log(field)}}
                            options={options}
                        />}
                    />
                    {errors.name && <span>This field is required</span>}

                    </Col>
                    <Col>
                    </Col>
                  </Row>
                  {action === 'edit' && 
                    <Row style={{marginTop:'5vh'}}>
                      <Button variant="primary" onClick={() => setShowWBSModal(true)} className="closeButton addWBSButton">Add/Edit WBS</Button>
                    </Row>}
                  <Row>
                    <Col>
                    <div className="submitDiv">
                        <input type="submit" className="submitButton" />
                        <Button variant="secondary" onClick={() => {setShowModal(false); reset()}} className="closeButton">Close</Button>
                    </div>
                    </Col>
                  </Row>

                </form>
                </Container>
      </Modal.Body>
    </Modal>
    <Modal size="lg" backdrop="static" show={showWBSModal} onHide={() => setShowWBSModal(false)}>
      <Modal.Header closeButton>
        <div className="d-flex justify-content-center">
          <Modal.Title>{action === 'create'? "Create": "Edit"} Deliverables</Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form onSubmit={onSubmitWBS}>
            {deliverables?.map((deliverable, i) => (
              <div key={i}>
                <Form.Group className="full-width">
                  <Form.Label className="main-label">Deliverables {i+1}</Form.Label>
                  <Form.Control
                    placeholder="Enter Deliverable"
                    type="text"
                    name="deliverable"
                    value={deliverable.deliverable}
                    onChange={(e)=>{handleDeliverableChange(i,e)}}
                    required
                  ></Form.Control>
                </Form.Group>
                <Form.Group className="full-width">
                  {deliverable?.sub_deliverables?.map((subdeliverable, idx) => (
                    <div key={idx} className="tier">
                      <Row 
                        style={{
                          margin: "2vh",
                        }}>
                          <Col sm={1}>
                            <Form.Label>{idx+1}.</Form.Label>
                          </Col>
                          <Col sm={9}>
                            <Form.Control
                              placeholder="Enter Sub-Deliverables"
                              type="text"
                              name="subdeliverable"
                              value={subdeliverable.sub_deliverable}
                              onChange={(e)=>{handleSubdeliverableChange(i,idx,e)}}
                              required
                            />
                          </Col>
                          <Col sm={2}>
                            <Button
                              variant="danger"
                              onClick={() => addDeliverables()}
                            >
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      </div>
                  ))}
                  <Button
                    variant="link"
                    className="addMoreBtn"
                    onClick={() => addSubdeliverables(i)}
                  >
                    +Add Sub-Deliverable
                  </Button>
                </Form.Group>
              </div>
          ))}
          <Button className="addMoreBtn" onClick={() => addDeliverables()}>
            +Add Deliverables
          </Button>
          <Row>
            <Col>
              <div className="submitDiv">
                <input type="submit" className="submitButton" />
                <Button variant="secondary" onClick={() => {setShowWBSModal(false)}} className="closeButton">Close</Button>
              </div>
            </Col>
          </Row>
        </Form>
        </Container>
      </Modal.Body>
    </Modal>
    <Alert show={showAlert} variant={success? "success": "danger"} style={{position:'fixed', top:0, right:0}} onClose={() => setShowAlert(false)} dismissible>
      <Alert.Heading>{success? "Success": "Failed"}</Alert.Heading>
      <p>{alsertMsg}</p>
      <hr />
    </Alert>
  </div>
)
}
