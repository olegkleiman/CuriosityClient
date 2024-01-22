import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Highlight from 'react-highlighter'
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
import Typewriter from 'typewriter-effect';

import Spin from './Spin'
import { ChatWindow } from './Chat';

const App = () => {

    const [prompt, setPrompt] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [onSearching, setOnSearching] = useState(false);
    const [modelName, setModelName] = useState('');

    useEffect(() => {

        const fetchData = async () => {

            try {
                const response = await axios.get('http://localhost:7071/api/model');
                const results = await response.data;
                setModelName(results)
            } catch (e) {
                console.error(e.message);
            }

        }

        fetchData();

    }, [])

    const onSearch = async (event) => {

        event.preventDefault();
        console.log(prompt)

        setSearchResults([])
        setOnSearching(true);

        try {
            const response = await axios.get('http://localhost:7071/api/Search?p=HUGGING_FACE&q=' + prompt);
            const results = await response.data;
            setSearchResults(results);

        } catch (err) {
            console.error(err);

        } finally {
            setOnSearching(false);
        }

    }

    return <>
        <ChatWindow />
        <Container className='container-fluid text-center'>
            <h1>
                <Typewriter 
                    onInit={(typewriter) => {
                        typewriter
                        .callFunction(() => {
                            document.querySelector(".Typewriter__cursor").style.display = "none";                            
                        })
                        .typeString('<strong>שאלות על ארנונה <span style="color: #27ae60;">באתר</span> tel-aviv.gov.il</strong>')
                        .start();
                    }}
                />
            </h1>
        </Container>
        <Container className='container-fluid mt-3'>
            <Row>
                <Col sm="1">
                    <Button className="btn-round" onClick={onSearch}>
                        <BsSearch />
                    </Button>
                </Col>
                <Col sm="11" style={{paddingRight: '0px'}}>
                    <Input value={prompt}
                    style={{border: '3px solid #ccc', height: '39px'}}
                        onChange={e => setPrompt(e.target.value)} autoFocus/>
                </Col>
            </Row>
            <div className='flex items-center'><b>{modelName}</b></div>
            {
                onSearching ?
                    <Spin /> : <></>
            }
            {
                searchResults.map((item, index) => {
                    return (
                        <Row key={index}>
                            <Col>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col md="2" className='p-3'>
                                                <img width={64} src={item.imageUrl} className='center-block' />
                                            </Col>
                                            <Col md="10" className='p-3'>
                                                <CardTitle tag="h5">
                                                    <a href={item.url} target='_blank'>{item.title}</a>
                                                </CardTitle>
                                                {/* <cite style={{ fontSize: 'small', textOverflow: 'ellipsis' }}>
                                                    {item.url}
                                                </cite> */}
                                                <div>Parent Doc Id: {item.parentDocId}</div>
                                                <div>Similarity: {item.similarity}</div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                    <CardBody>
                                        <CardText>
                                            <Highlight search='מסמכים'>{item.summary}</Highlight>
                                        </CardText>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    )
                })
            }
        </Container>
    </>

}

export default App;