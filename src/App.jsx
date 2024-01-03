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

import Spin from './Spin'
import { Demo } from './Chat';

const App = () => {

    const [prompt, setPrompt] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [onSearching, setOnSearching] = useState(false)

    useEffect(() => {

        const fetchData = async () => {

            try {

            } catch (e) {
                console.error(e.message);
            }

        }

    }, [])

    const onSearch = async (event) => {

        event.preventDefault();
        console.log(prompt)

        setSearchResults([])
        setOnSearching(true);

        try {
            const response = await axios.get('http://localhost:7071/api/Recall?q=' + prompt);
            const results = await response.data;
            setSearchResults(results);

        } catch (err) {
            console.error(err);

        } finally {
            setOnSearching(false);
        }

    }

    return <>
        <Demo />
        <Container className='container-fluid text-center'>
            <h1>Semantic Search on tel-aviv.gov.il</h1>
            <p>Click here for a chatbot</p>
        </Container>
        <Container className='container-fluid mt-3'>
            <Row>
                <Col sm="1" className='p-3'>
                    <Button className="btn-round" onClick={onSearch}>
                        <BsSearch />
                    </Button>
                </Col>
                <Col sm="11" className='p-3'>
                    <Input value={prompt}
                        onChange={e => setPrompt(e.target.value)} />
                </Col>
            </Row>
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
                                                <cite style={{ fontSize: 'small', textOverflow: 'ellipsis' }}>
                                                    {item.url}
                                                </cite>
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