import React, { useEffect, useState } from 'react'
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { Button, Col, Form, Row, Modal } from 'react-bootstrap';
import router from './router';
import bgImage from '../utilities/images/bg-mindmaps.jpg'
export const Login = () => {
    const [email, setemail] = useState(null);
    const [password, setpassword] = useState(null);
    const [showLoginSection, setshowLoginSection] = useState(false);
    const handleLogin = () => {
        setshowLoginSection(true);
    }
    const handleTryNow = () => {
        alert('Comming soon!')
    }
    const handleSignIn = () => {
        // if (email === 'mindmaps@accionlabs.com' && password === 'MindM@p$') {
        router.setRoute('home');
        window.sessionStorage.setItem("mindMapsAuth", true)
        // } else {
        //     window.sessionStorage.setItem("mindMapsAuth", false)
        // }
    }
    useEffect(() => {
        setemail(null);
        setpassword(null)
    }, [])

    return (<>
        <div style={{
            display: 'flex', alignItems: 'center', backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
            , minHeight: '650px'
        }}>
            <div>
                {!showLoginSection && <Row className='login' >
                    <Col xs={2}>
                    </Col>
                    <Col>{<div>
                        <div style={{ fontSize: '40px', fontWeight: '600' }}>Make your process even easier!</div>
                        <div style={{ display: 'flex' }}>
                            <button class="button-87" role="button" onClick={handleLogin}>Login</button>
                            <button class="button-87" role="button" onClick={handleTryNow}>Try Now</button>
                        </div></div>}</Col>
                </Row>}
                {showLoginSection &&
                    <Row className='p-3' style={{ width: '650px' }}>
                        <Col xs={2}>
                        </Col>
                        <Col className='p-3' style={{backgroundColor: '#f6c9c1',
                            }}><div className='p-2' style={{
                            background: 'rgba(255, 255, 255, 0.32)',
                            borderRadius: '16px',
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(10.1px)',
                            border: '1px solid rgba(255, 255, 255, 0.43)'
                        }}>
                            <h3 className='pt-3'>
                                Enter details to login
                            </h3>
                            <Form>
                                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                    <Form.Label column sm="4">
                                        Email
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control email defaultValue="email@example.com" value={email} onChange={(e) => setemail(e.target.value)} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Password
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="password" placeholder="Password" value={password} onChange={e => setpassword(e.target.value)} />
                                    </Col>
                                </Form.Group>
                            </Form>
                            <div className='m-3'>
                                <Button onClick={handleSignIn}>
                                    Login
                                </Button>
                            </div>
                        </div>
                        </Col>

                    </Row>
                }
            </div>

        </div>

    </>

    )
}
