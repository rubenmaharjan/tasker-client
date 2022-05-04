import React, { useState } from "react";
import {Alert, Button, Form, Modal, Toast, Container, Row, Col} from "react-bootstrap"
import { Project } from "./Project.model";
import DatePicker from "react-datepicker";
import moment from "moment";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import ProjectApi from "../../services/project.api";
import Select from 'react-select'
import {useNavigate} from 'react-router-dom';


export interface ProjectProps {
  action?: string
  project?: Project
}

export const CreateProject: React.FC<ProjectProps> = ({action, project}) => {

  const navigate = useNavigate();

  const { register, handleSubmit, control, formState: { errors }, setValue , reset} = useForm({
  });
  const [showAlert, setShowAlert] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [success, setSuccess] = useState(false)
  const [alsertMsg, setAlertMsg] = useState('')
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "WBS", // unique name for your Field Array
  });

  const options = [
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
    { value: "months", label: "Vanilla" }
  ]


  React.useEffect(() => {
    if(showModal){
      if(project){
        setValue( "name", project.name );
        setValue( "duration", project.duration );
        setValue( "duration_type", options.filter(option => option.value === project.duration_type) );
        setValue("start_date", moment(project?.start_date).toDate())
      }
    }
  }, [showModal])

  const onSubmit = (data: any) => {
    console.log(data)
    //        data.id = project?.id
    //        data.start_date = moment(data?.start_date).format("YYYY-MM-DD")
    //        data.duration_type = data?.duration_type?.value || options[0].value
    //        console.log(data)
    //        if(action == 'create'){
    //            ProjectApi.createProject(data).then(response => {
    //                console.log("Created Project", response)
    //                setSuccess(true) 
    //                setAlertMsg("Project was Created!")
    //            }).catch(err => {
    //                setSuccess(false)
    //                setAlertMsg("Project was not Created!")
    //                console.log(err.message)
    //            })
    //            setShowAlert(true)
    //        }
    //        else {
    //            ProjectApi.editProject(data).then(response => {
    //                console.log("Created Project", response)
    //                setSuccess(true)
    //                setAlertMsg("Project was Edited!")
    //            }).catch(err => {
    //                setSuccess(false)
    //                setAlertMsg("Project was not Edited!")
    //            })
    //            setShowAlert(true)
    //        }
    //        reset();
    //        setShowModal(false);
  }

  return (
    <div>
      <div>
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
</Row>
<Row>
  <Button variant="primary" onClick={()=> setShowModal(true)} className="closeButton">Add WBS</Button>
</Row>
<Row>
  <Col>
    <div className="submitDiv">
      <input type="submit" className="submitButton" />
      <Button variant="secondary" onClick={() => {navigate("/")}} className="closeButton">Close</Button>
    </div>
  </Col>
</Row>

</form>
      </div>

      <div>
        <Modal size="xl" show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <div className="d-flex justify-content-center">
              <Modal.Title>Add Deliverables</Modal.Title>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Col>
                <ol>
                  {fields.map((item, index) => {
                    return (
                    <li key={item.id}>
                      <input
                        name={`test[${index}].firstName`}
                        placeholder="Deliverable"
                      />

                    <button type="button" onClick={() => remove(index)}>
                      Delete
                    </button>
                  </li>
                );
                  })}
                </ol>
                <Button variant="primary" onClick={() => {append({test:''})}} className="closeButton">Add WBS</Button>
              </Col>
            </Container>
          </Modal.Body>
        </Modal>
        <Alert show={showAlert} variant={success? "success": "danger"} style={{position:'fixed', top:0, right:0}} onClose={() => setShowAlert(false)} dismissible>
          <Alert.Heading>{success? "Success": "Failed"}</Alert.Heading>
          <p>{alsertMsg}</p>
          <hr />
        </Alert>
      </div>
    </div>
  )
}
