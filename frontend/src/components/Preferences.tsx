import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import { Link } from "react-router";

type Focus = "systems" | "theory" | "ai_ml" | "software" | "none";
type Pacing = "light" | "balanced" | "intense";

function Preferences() {
  const [csCount, setCsCount] = useState(3);
  const csCountOptions = [2, 3, 4];
  const [pacing, setPacing] = useState("balanced");
  const [maxHeavy, setMaxHeavy] = useState(2);

  const [focus, setFocus] = useState<Focus>("systems");

  const focusOptions: { value: Focus; label: string }[] = [
    { value: "systems", label: "Systems" },
    { value: "theory", label: "Theory" },
    { value: "ai_ml", label: "AI / ML" },
    { value: "software", label: "Software" },
    { value: "none", label: "No Preference " },
  ];

  const [prioritizeUnlocks, setPrioritizeUnlocks] = useState(true);
  const [avoidTooManyProg, setAvoidTooManyProg] = useState(true);

  return (
    <Card className="pageCard preferencesCard">
      <Card.Body>
        <Button
          variant="outline-primary"
          size="sm"
          className="px-2 mb-4"
          as={Link}
          to={"/builder/completed-courses"}
        >
          ← Back
        </Button>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <Card.Title className="mb-0">Preferences</Card.Title>
            <div className="text-muted small">
              Tune recommendations to match your goals.
            </div>
          </div>
        </div>

        <Row className="g-4">
          <Col xs={12}>
            <Form.Label className="fw-semibold">Class load</Form.Label>
            <div className="text-muted small mb-2">
              How many CS classes do you want in your term?
            </div>
            <ButtonGroup>
              {csCountOptions.map((n) => (
                <ToggleButton
                  variant="outline-primary"
                  key={n}
                  id={`credit-${n}`}
                  type="radio"
                  name="creditLoad"
                  value={n}
                  checked={csCount == n}
                  onChange={() => setCsCount(n)}
                >
                  {n}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </Col>

          <Col xs={12} md={6}>
            <Form.Label className="fw-semibold">Focus area</Form.Label>
            <div className="text-muted small mb-2">
              Helps pick electives that match what you’re interested in.
            </div>

            <Form.Select
              value={focus}
              onChange={(e) => setFocus(e.target.value as Focus)}
            >
              {focusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col xs={12} md={6}>
            <Form.Label className="fw-semibold">Semester intensity</Form.Label>
            <div className="text-muted small mb-2">
              Controls how “heavy” the recommended set feels.
            </div>

            <Form.Select
              value={pacing}
              onChange={(e) => setPacing(e.target.value as Pacing)}
            >
              <option value="light">🧘 Lighter</option>
              <option value="balanced">⚖️ Balanced</option>
              <option value="intense">🔥 Intense</option>
            </Form.Select>
          </Col>

          <Col xs={12}>
            <Form.Label className="fw-semibold">
              Max heavy CS courses
            </Form.Label>
            <div className="text-muted small mb-2">
              Limits how many "heavy" CS courses we try to schedule together
            </div>

            <ButtonGroup>
              {[1, 2, 3].map((n) => (
                <ToggleButton
                  key={n}
                  id={`maxHeavy-${n}`}
                  type="radio"
                  name="maxHeavy"
                  value={n}
                  variant={maxHeavy === n ? "primary" : "outline-primary"}
                  checked={maxHeavy === n}
                  onChange={() => setMaxHeavy(n)}
                >
                  {n}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </Col>

          <Col xs={12}>
            <Form.Label className="fw-semibold">Options</Form.Label>
            <div className="text-muted small mb-2">
              These slightly bias recommendations (they don't hard-block).
            </div>

            <Form.Check
              type="switch"
              id="pref-unlock"
              label="Prefer courses that unlock prerequisites"
              checked={prioritizeUnlocks}
              onChange={(e) => setPrioritizeUnlocks(e.target.checked)}
              className="mb-2"
            />

            <Form.Check
              type="switch"
              id="pref-avoid-prog"
              label="Avoid too many programming-heavy courses in one term"
              checked={avoidTooManyProg}
              onChange={(e) => setAvoidTooManyProg(e.target.checked)}
            />
          </Col>
        </Row>
      </Card.Body>
      <Button variant="primary" size="lg" as={Link} to={"/builder/schedule"}>
        Generate Schedule →
      </Button>
    </Card>
  );
}

export default Preferences;
