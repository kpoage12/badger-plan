import { useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Preferences from "./Preferences";

import courses from "../data/data";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Link } from "react-router-dom";

type Course = { name: string; subtitle: string; credits: number };

function Builder() {
  const [completed, setCompleted] = useLocalStorage<Course[]>(
    "badgerplan.completedCourses",
    []
  );
  const [query, setQuery] = useState("");

  const completedSet = useMemo(
    () => new Set(completed.map((c) => c.name)),
    [completed]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses
      .filter((c) => !completedSet.has(c.name))
      .filter((c) => {
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q)
        );
      });
  }, [query, completedSet]);

  function addCourse(course: Course) {
    setCompleted((prev) => [...prev, course]);
  }

  function removeCourse(name: string) {
    setCompleted((prev) => prev.filter((c) => c.name !== name));
  }

  const totalCredits = completed.reduce((sum, c) => sum + c.credits, 0);

  return (
    <Container className="py-4">
      <Row className="g-4">
        <Col md={5} lg={4}>
          <div className="pageCard">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="h5 mb-0">Completed</h2>
              <Badge bg="secondary">{totalCredits} credits</Badge>
            </div>

            {completed.length === 0 ? (
              <div className="text-muted">No courses added yet.</div>
            ) : (
              <ListGroup variant="flush">
                {completed.map((c) => (
                  <ListGroup.Item
                    key={c.name}
                    className="d-flex align-items-start justify-content-between"
                  >
                    <div>
                      <div className="fw-semibold">{c.name}</div>
                      <div className="text-muted small">{c.subtitle}</div>
                      <div className="small">{c.credits} credits</div>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeCourse(c.name)}
                    >
                      Remove
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </Col>
        <Col md={7} lg={8}>
          <div className="pageCard">
            <h2 className="h5 mb-3">Add courses</h2>

            <Form.Control
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search (e.g. "Comp Sci 400")'
              className="mb-3"
            />

            <ListGroup>
              {filtered.length === 0 ? (
                <ListGroup.Item className="text-muted">
                  No matches.
                </ListGroup.Item>
              ) : (
                filtered.map((c) => (
                  <ListGroup.Item
                    key={c.name}
                    action
                    onClick={() => addCourse(c)}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div className="fw-semibold">{c.name}</div>
                      <div className="text-muted small">{c.subtitle}</div>
                    </div>
                    <Badge bg="light" text="dark">
                      {c.credits}
                    </Badge>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
            <div className="text-muted small mt-3">
              Tip: click a course to add it to your completed list.
            </div>
            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="primary"
                size="lg"
                as={Link}
                to={"/builder/preferences"}
              >
                Continue to Preferences →
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Builder;
