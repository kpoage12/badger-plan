import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

interface ClassProps {
  name: string;
  subtitle: string;
  credits: number;
}

function Class({ name, subtitle, credits }: ClassProps) {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <div>
          <Card.Title className="mb-1">{name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{subtitle}</Card.Subtitle>
          <Card.Text className="fw-semibold">{credits} credits</Card.Text>
        </div>
        <Button variant="outline-primary" className="mt-auto w-100">
          Add Course
        </Button>
      </Card.Body>
    </Card>
  );
}

export default Class;
