import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";

import type { SessionUser } from "../services/session";

type HomeProps = {
  sessionUser: SessionUser | null;
};

function Home({ sessionUser }: HomeProps) {
  const navigate = useNavigate();

  return (
    <Container>
      <div className="py-5 text-center">
        <h1 className="mb-3">Plan your UW-Madison Schedule</h1>
        <p className="lead text muted mb-4">
          Build a semester plan based on what you've already taken
        </p>
        <Button
          onClick={() =>
            navigate(sessionUser ? "/builder/completed-courses" : "/signup")
          }
          size="lg"
        >
          {sessionUser ? "Start Planning" : "Create Account to Save Plans"}
        </Button>
      </div>

      <Row className="g-4 mt-4">
        <Col md={4}>
          <Card className="homeStepCard h-100">
            <Card.Body>
              <div className="stepIcon">1</div>
              <Card.Title className="mt-3">Create your account</Card.Title>
              <Card.Text className="text-muted">
                Sign up once and BadgerPlan keeps your saved planning data tied to
                your session.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="homeStepCard h-100">
            <Card.Body>
              <div className="stepIcon">2</div>
              <Card.Title className="mt-3">Add completed courses</Card.Title>
              <Card.Text>
                Record what you have already finished and tune your preferences.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="homeStepCard h-100">
            <Card.Body>
              <div className="stepIcon">3</div>

              <Card.Title className="mt-3">Generate and save</Card.Title>
              <Card.Text>
                Creating a schedule posts it to the backend and stores it on your
                account.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
