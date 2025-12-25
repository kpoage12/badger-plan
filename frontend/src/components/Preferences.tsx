import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import type { Focus, Pacing } from "../types/course";
import type { CsPrefs } from "../types/preferences";

type Props = {
  value: CsPrefs;
  onChange: (next: CsPrefs) => void;
};

function Preferences({ value, onChange }: Props) {
  const csCountOptions: Array<2 | 3 | 4> = [2, 3, 4];

  const focusOptions: { value: Focus; label: string }[] = [
    { value: "systems", label: "Systems" },
    { value: "theory", label: "Theory" },
    { value: "ai_ml", label: "AI / ML" },
    { value: "software", label: "Software" },
    { value: "none", label: "No Preference" },
  ];

  return (
    <Card className="pageCard preferencesCard">
      <Card.Body>
        <Button
          variant="outline-primary"
          size="sm"
          className="px-2 mb-4"
          as={Link}
          to="/builder/completed-courses"
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
                  key={n}
                  id={`csCount-${n}`}
                  type="radio"
                  name="csCount"
                  value={n}
                  variant={value.csCount === n ? "primary" : "outline-primary"}
                  checked={value.csCount === n}
                  onChange={() => onChange({ ...value, csCount: n })}
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
              value={value.focus}
              onChange={(e) =>
                onChange({ ...value, focus: e.target.value as Focus })
              }
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
              value={value.pacing}
              onChange={(e) =>
                onChange({ ...value, pacing: e.target.value as Pacing })
              }
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
              Limits how many “heavy” CS courses we try to schedule together
            </div>

            <ButtonGroup>
              {([1, 2, 3] as const).map((n) => (
                <ToggleButton
                  key={n}
                  id={`maxHeavy-${n}`}
                  type="radio"
                  name="maxHeavy"
                  value={n}
                  variant={value.maxHeavy === n ? "primary" : "outline-primary"}
                  checked={value.maxHeavy === n}
                  onChange={() => onChange({ ...value, maxHeavy: n })}
                >
                  {n}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </Col>

          <Col xs={12}>
            <Form.Label className="fw-semibold">Options</Form.Label>
            <div className="text-muted small mb-2">
              These slightly bias recommendations (they don’t hard-block).
            </div>

            <Form.Check
              type="switch"
              id="pref-unlock"
              label="Prefer courses that unlock prerequisites"
              checked={value.prioritizeUnlocks}
              onChange={(e) =>
                onChange({ ...value, prioritizeUnlocks: e.target.checked })
              }
              className="mb-2"
            />

            <Form.Check
              type="switch"
              id="pref-avoid-prog"
              label="Avoid too many programming-heavy courses in one term"
              checked={value.avoidTooManyProg}
              onChange={(e) =>
                onChange({ ...value, avoidTooManyProg: e.target.checked })
              }
            />
          </Col>
        </Row>
      </Card.Body>

      <Card.Body className="pt-0">
        <Button
          className="w-100"
          variant="primary"
          size="lg"
          as={Link}
          to="/builder/schedule"
        >
          Generate Schedule →
        </Button>
      </Card.Body>
    </Card>
  );
}

export default Preferences;
