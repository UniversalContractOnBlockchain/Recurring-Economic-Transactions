import React,{ Component } from 'react'
import { Form } from 'react-bootstrap';
 
class DatePicker extends Component{
 
    render(){
 
        return(
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <Form.Group controlId="dob">
                            <Form.Label>Contract Duration</Form.Label>
                            <Form.Control type="date" className="dob" placeholder="Date of Birth" />
                        </Form.Group>
                    </div>
                </div>
            </div>
        )
    }
     
}
 
export default DatePicker;