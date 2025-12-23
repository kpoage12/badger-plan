import Class from "./Class";
import classes from "../data/data";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Browse() {
  return (
    <Container>
      <Row>
        {classes.map((c) => (
          <Col key={c.name} xs={12} sm={12} md={6} lg={4} xl={3}>
            <Class name={c.name} subtitle={c.subtitle} credits={c.credits} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Browse;
