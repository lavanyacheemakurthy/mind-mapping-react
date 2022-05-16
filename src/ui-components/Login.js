import React, { useEffect, useState } from 'react'
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { Button, Col, Form, Row } from 'react-bootstrap';
import router from './router';
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
        if (email === 'mindmaps@accionlabs.com' && password === 'MindM@p$') {
            router.setRoute('home');
            window.sessionStorage.setItem("mindMapsAuth", true)
        } else {
            window.sessionStorage.setItem("mindMapsAuth", false)
        }
    }
    useEffect(() => {
        setemail(null);
        setpassword(null)
    }, [])

    return (<>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><Player
                autoplay
                loop
                src="https://assets6.lottiefiles.com/packages/lf20_lvujj4wv.json"
                style={{ height: '400px', width: '400px' }}
            >
                <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
            </Player></div>
            <div>
                {!showLoginSection && <div className='login' >
                    <div style={{ fontSize: '40px', fontWeight: '600' }}>Make your process even easier!</div>
                    <div style={{ display: 'flex' }}>
                        <button class="button-87" role="button" onClick={handleLogin}>Login</button>
                        <button class="button-87" role="button" onClick={handleTryNow}>Try Now</button>
                    </div>
                </div>}
                {showLoginSection && <div >
                    <div >

                        <div>
                            <h3>
                                Please Login
                            </h3>
                            <Form>
                                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                    <Form.Label column sm="3">
                                        Email
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control email defaultValue="email@example.com" value={email} onChange={(e) => setemail(e.target.value)} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                    <Form.Label column sm="3">
                                        Password
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control type="password" placeholder="Password" value={password} onChange={e => setpassword(e.target.value)} />
                                    </Col>
                                </Form.Group>
                            </Form>
                            <div>
                                <Button onClick={handleSignIn}>
                                    Login
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>}
            </div>
            <div><Player
                autoplay
                loop
                src="https://assets9.lottiefiles.com/packages/lf20_1okmstwb.json"
                style={{ height: '400px', width: '400px' }}
            >
                <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
            </Player></div>
        </div>

    </>

    )
}
