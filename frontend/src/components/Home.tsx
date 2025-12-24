import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Container>
      <div className="py-5 text-center">
        <h1 className="mb-3">Plan your UW-Madison Schedule</h1>
        <p className="lead text muted mb-4">
          Build a semester plan based on what you've already taken
        </p>
        <Button as={Link} to="/builder/completed-courses" size="lg">
          Start Planning
        </Button>
      </div>

      <Row className="g-4 mt-4">
        <Col md={4}>
          <Card className="homeStepCard h-100">
            <Card.Body>
              <div className="stepIcon">1</div>
              <Card.Title className="mt-3">Add completed courses</Card.Title>
              <Card.Text className="text-muted">
                Tell use what credits or courses you've already earned.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="homeStepCard h-100">
            <Card.Body>
              <div className="stepIcon">2</div>
              <Card.Title className="mt-3">Set goals</Card.Title>
              <Card.Text>
                Choose your term, class count, and preferences.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="homeStepCard h-100">
            <Card.Body>
              <div className="stepIcon">3</div>

              <Card.Title className="mt-3">Get recommendations</Card.Title>
              <Card.Text>
                We'll suggest classes and alternative options.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
