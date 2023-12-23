import React from 'react';
import {
    Row, Col,
    Spinner
} from 'reactstrap';

const Spin = () => 
        <Row>
            <Col md="6"></Col>
            <Col md="6">
                <Spinner  type="grow" color="primary" className="m-5">
                Loading...
                </Spinner> 
            </Col>
        </Row>


export default Spin;                