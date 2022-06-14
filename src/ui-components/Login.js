import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import router from "./router";
// import bgImage from '../utilities/images/bg-mindmaps.jpg'
import bgImage1 from "../utilities/images/bg-mindmaps-1.png";
import loginEmptyCenter from "../utilities/images/login-empty-center.png";
import loginLeft from "../utilities/images/login-left.png";
import logo from "../utilities/images/logo.jpg";
import loginBottomLogo from "../utilities/images/login-bottom-logo.png";
import css from "./login.module.css";
export const Login = () => {
  const [email, setemail] = useState(null);
  const [password, setpassword] = useState(null);
  const [showLoginSection, setshowLoginSection] = useState(false);
  const handleLogin = () => {
    setshowLoginSection(true);
  };
  const handleTryNow = () => {
    alert("Comming soon!");
  };
  const handleSignIn = () => {
    // if (email === 'mindmaps@accionlabs.com' && password === 'MindM@p$') {
    router.setRoute("home");
    window.sessionStorage.setItem("mindMapsAuth", true);
    // } else {
    //     window.sessionStorage.setItem("mindMapsAuth", false)
    // }
  };
  useEffect(() => {
    setemail(null);
    setpassword(null);
  }, []);

  return (
    <>
      {!showLoginSection && (
        <div
          id="landing"
          style={{
            display: "flex",
            backgroundImage: `url(${bgImage1})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            flexFlow: "column",
            minHeight: "600px",
            position: "fixed",
            top: "0",
            left: "0",
            minWidth: "100%",
            minHeight: "100%",
          }}
        >
          <div>
            {
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "20px",
                  }}
                >
                  <div>
                    <img
                      alt="logo"
                      src={logo}
                      onClick={() => {
                        router.setRoute("login");
                        setshowLoginSection(false);
                      }}
                    />
                  </div>
                  <div className="m-3">
                    {" "}
                    <Button variant="outline-warning">SIGNUP</Button>
                  </div>
                </div>
                <Row className="login" style={{ paddingTop: "100px" }}>
                  <Col xs={2}></Col>
                  <Col xs={6}>
                    {
                      <div>
                        <div style={{ fontSize: "40px", fontWeight: "800" }}>
                          Make Your Process <br></br>Even Easier!
                        </div>
                        <div>
                          <Button
                            className="m-4"
                            onClick={handleLogin}
                            variant="outline-warning"
                          >
                            Login
                          </Button>
                          <Button onClick={handleTryNow} variant="warning">
                            Try Now
                          </Button>
                        </div>
                      </div>
                    }
                  </Col>
                </Row>
              </div>
            }
          </div>
        </div>
      )}
      {showLoginSection && (
        <div id="login">
          {false && (
            <Row className="p-3" style={{ width: "650px" }}>
              <Col xs={2}></Col>
              <Col
                className="p-3"
                style={{
                  backgroundColor: "#f6c9c1",
                }}
              >
                <div
                  className="p-2"
                  style={{
                    background: "rgba(255, 255, 255, 0.32)",
                    borderRadius: "16px",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(10.1px)",
                    border: "1px solid rgba(255, 255, 255, 0.43)",
                  }}
                >
                  <h3 className="pt-3">Enter details to login</h3>
                  <Form>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextEmail"
                    >
                      <Form.Label column sm="4">
                        Email
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          email
                          defaultValue="email@example.com"
                          value={email}
                          onChange={(e) => setemail(e.target.value)}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextPassword"
                    >
                      <Form.Label column sm="4">
                        Password
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setpassword(e.target.value)}
                        />
                      </Col>
                    </Form.Group>
                  </Form>
                  <div className="m-3">
                    <Button onClick={handleSignIn}>Login</Button>
                  </div>
                </div>
              </Col>
            </Row>
          )}
          {true && (
            <div>
              <Row
                style={{
                  padding: "3%",
                }}
                className={css.loginBg}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img src={loginLeft} alt="loginLeft" />
                  <div
                    style={{
                      padding: "50px",
                      paddingLeft: "0px",
                      margin: "30px",
                      marginLeft: "0px",
                      minWidth: "500px",
                      backgroundColor: "white",
                    }}
                  >
                    <div style={{ paddingLeft: "30px" }}>
                      <h4>Please Login</h4>
                      <Form>
                        <Form.Label column className="mt-3">
                          Email address
                        </Form.Label>
                        <Form.Group
                          as={Row}
                          className="mb-3"
                          controlId="formPlaintextEmail"
                        >
                          <Col>
                            <Form.Control
                              email
                              placeholder="email@example.com"
                              value={email}
                              onChange={(e) => setemail(e.target.value)}
                            />
                          </Col>
                        </Form.Group>
                        <div className="mt-4"></div>
                        <Form.Label column>Password</Form.Label>
                        <Form.Group
                          as={Row}
                          className="mb-3"
                          controlId="formPlaintextPassword"
                        >
                          <Col>
                            <Form.Control
                              type="password"
                              placeholder="Password"
                              value={password}
                              onChange={(e) => setpassword(e.target.value)}
                            />
                          </Col>
                        </Form.Group>
                      </Form>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          color: "#ffc107",
                        }}
                      >
                        <div>Forgot password ?</div>
                      </div>
                      <div className="d-grid gap-2 mt-3">
                        <Button
                          variant="outline-warning"
                          size="md"
                          onClick={handleSignIn}
                        >
                          SIGNIN
                        </Button>
                      </div>
                      <div
                        className="m-3"
                        style={{
                          fontSize: "12px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        Don't have account ?{" "}
                        <span style={{ color: "#ffc107" }}>
                          {" "}
                          &nbsp;&nbsp;Sign Up
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={loginBottomLogo}
                          alt="loginBottomLogo"
                          onClick={() => {
                            window.open("https://www.accionlabs.com/");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Row>
            </div>
          )}
        </div>
      )}
    </>
  );
};
