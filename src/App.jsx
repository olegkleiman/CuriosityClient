import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Container,
    Button,
    Input,
    Row, Col,
    Card,
    CardBody,
    CardTitle, CardSubtitle, CardText,
    Spinner
} from 'reactstrap';
import { BsSearch } from "react-icons/bs";

import Spin from './Spin'

const App = () => {

    const [prompt, setPrompt] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [onSearching, setOnSearching] = useState(false)

    useEffect( () => {

        const fetchData = async() => {

            try {

            } catch(e) {
                console.error(e.message);
            }

        }

    }, [])

    const onSearch = async(event) => {
        
        event.preventDefault();
        console.log(prompt)
        
        setSearchResults([])
        setOnSearching(true);

        try
        {
            const response = await axios.get('http://localhost:7082/api/Search2?q=' + prompt);
            const results = await response.data;
            setSearchResults(results);

        } catch(err) {
            console.error(err);
            
        } finally {
            setOnSearching(false);
        }

    }

    return <Container>
        <h1 style={{display: "flex", justifyContent:"center"}}>
            Semantic Search on tel-aviv.gov.il
        </h1>
        <Row>
            <Col md="1" style={{color:'red'}}>
                <Button className="btn-round" onClick={onSearch}>
                    <BsSearch />
                </Button>
             </Col> 
            <Col md="11">
                <Input value={prompt}
                    onChange={ e => setPrompt(e.target.value)} />
            </Col>
        </Row>
        {
            onSearching? 
                <Spin />: <></>
        }
        {
            searchResults.map( (item, index) => {
                return (
                    <Card key={index}>
                        <CardBody>
                            <Row>
                                <Col md="1">
                                    <img width={64} src={item.imageUrl} />
                                </Col>                                
                                <Col md="11">
                                    <CardTitle tag="h5">{item.title}</CardTitle>
                                    <CardSubtitle>
                                        <a href={item.url} target='_blank'>{item.url}</a>
                                    </CardSubtitle>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardBody>
                            <CardText>{item.summary}</CardText>
                        </CardBody>
                    </Card>
                )
            })
        }
    </Container>

}

export default App;