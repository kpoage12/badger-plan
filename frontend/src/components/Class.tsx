import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

interface ClassProps {
  name: string;
  subtitle: string;
  credits: number;
}

function Class({ name, subtitle, credits }: ClassProps) {
  return (
    <Card className="mt-2" style={{ width: "18rem" }}>
      <Card.Body>
        <div>
          <Card.Title className="mb-1">{name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{subtitle}</Card.Subtitle>
          <Card.Text className="fw-semibold">{credits} credits</Card.Text>
        </div>
        <Button variant="outline-primary" className="mt-2 w-100">
          More Details
        </Button>
      </Card.Body>
    </Card>
  );
}

export default Class;
