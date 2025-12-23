import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

interface ClassProps {
  name: string;
  subtitle: string;
  credits?: number;
}

function Class({ name, subtitle, credits }: ClassProps) {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
      </Card.Body>
      <Card.Text>{subtitle} credits</Card.Text>
      <Card.Text>{credits} credits</Card.Text>
      <Button variant="primary">Add Course</Button>
    </Card>
  );
}

export default Class;
