import { useEffect, useMemo, useState, type MouseEvent } from "react";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Link } from "react-router-dom";

import { useLocalStorage } from "../hooks/useLocalStorage";
import courses from "../data/data";
import type { CsCourse } from "../types/course";
import type { CsPrefs } from "../types/preferences";
import { DEFAULT_CS_PREFS } from "../types/preferences";
import Modal from "react-bootstrap/esm/Modal";
import { getSchedule } from "../services/planner";
import type { generateSchedule } from "../planner/generateSchedule";

function Schedule() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [completed] = useLocalStorage<CsCourse[]>(
    "badgerplan.completedCourses",
    []
  );
  const [prefs] = useLocalStorage<CsPrefs>(
    "badgerplan.csPrefs.v1",
    DEFAULT_CS_PREFS
  );

  const completedIDs = useMemo(() => completed.map((c) => c.id), [completed]);

  const courseById = useMemo(() => {
    const map = new Map<string, CsCourse>();
    (courses as CsCourse[]).forEach((c) => map.set(c.id, c));
    return map;
  }, []);

  const [scheduleState, setScheduleState] = useState<ReturnType<
    typeof generateSchedule
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swapFromId, setSwapFromId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const result = await getSchedule(
          courses as CsCourse[],
          completedIDs,
          prefs
        );
        if (!cancelled) setScheduleState(result);
      } catch (e) {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : "Failed to generate schedule"
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [completedIDs, prefs]);

  if (loading) return <h2 className="p-4">Generating schedule…</h2>;
  if (error) return <h2 className="p-4">Error: {error}</h2>;
  if (!scheduleState) return null;

  return (
    <Container className="py-4">
      <div className="d-flex align-items-start justify-content-between mb-3">
        <div>
          <Button
            as={Link}
            to="/builder/preferences"
            variant="outline-primary"
            size="sm"
            className="mb-2"
          >
            ← Back to Preferences
          </Button>

          <h1 className="h3 mb-1">Recommended Schedule</h1>
          <div className="text-muted">
            {prefs.csCount} CS courses • {scheduleState.estimatedCredits}{" "}
            credits •{" "}
            {prefs.focus === "none"
              ? "No track focus"
              : `Focus: ${prefs.focus}`}{" "}
            • {prefs.pacing}
          </div>
        </div>
        <Button
          as={Link}
          to="/builder/completed-courses"
          variant="outline-secondary"
        >
          Edit Completed Courses
        </Button>
      </div>
      {scheduleState.warnings.length > 0 && (
        <div className="mb-3">
          {scheduleState.warnings.map((w) => (
            <Alert key={w.code} variant="warning" className="mb-2">
              {w.message}
            </Alert>
          ))}
        </div>
      )}
      <Row className="g-4">
        <Col xs={12}>
          <div className="d-flex align-items-center justify-content-between">
            <h2 className="h5 mb-0">This term</h2>
            <Badge bg="secondary">
              {scheduleState.selected.length}/{prefs.csCount} courses
            </Badge>
          </div>
        </Col>

        {scheduleState.selected.map((s) => {
          const course = courseById.get(s.id);
          if (!course) {
            return (
              <Col key={s.id} xs={12} sm={6} lg={4}>
                <Card className="h-100">
                  <Card.Body>
                    <Card.Title>{s.id}</Card.Title>
                    <Card.Text className="text-muted">
                      Could not find course details in catalog.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          }

          return (
            <Col key={course.id} xs={12} sm={6} lg={4}>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                  <Stack direction="horizontal" gap={2} className="mb-2">
                    <Card.Title className="mb-0">{course.code}</Card.Title>
                    <Badge bg="light" text="dark" className="ms-auto">
                      {course.credits} cr
                    </Badge>
                  </Stack>

                  <Card.Subtitle className="text-muted mb-2">
                    {course.title}
                  </Card.Subtitle>
                  <Card.Text className="small mb-3">{s.reason}</Card.Text>
                  <div className="mt-auto d-grid gap-2">
                    <Button
                      variant={
                        swapFromId === course.id ? "primary" : "outline-primary"
                      }
                      size="sm"
                      onClick={() =>
                        setSwapFromId((prev) =>
                          prev === course.id ? null : course.id
                        )
                      }
                    >
                      {swapFromId === course.id ? "Cancel Swap" : "Swap"}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleShow}
                    >
                      More Details
                    </Button>
                    <div
                      className="modal show"
                      style={{ display: "block", position: "initial" }}
                    >
                      <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>{course.code}</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                          {course.title}
                          <br />
                          {course.credits} credits
                        </Modal.Body>

                        <Modal.Footer>
                          <Button variant="primary" onClick={handleClose}>
                            Close
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      <div className="mt-5">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h2 className="h5 mb-0">Alternatives</h2>
        </div>
        {swapFromId && (
          <Alert variant="info" className="mb-3">
            Choose a course to swap in for <strong>{swapFromId}</strong>.
          </Alert>
        )}

        <div className="d-flex gap-3 overflow-auto pb-2">
          {scheduleState.alternatives.slice(0, 12).map((id) => {
            const c = courseById.get(id);
            if (!c) return null;
            return (
              <Card key={id} style={{ minWidth: 260 }}>
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="fw-semibold">{c.code}</div>
                    <Badge bg="light" text="dark">
                      {c.credits} cr
                    </Badge>
                  </div>
                  <div className="text-muted small">{c.title}</div>
                  {swapFromId && (
                    <div className="mt-2 d-grid gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setScheduleState((prev) => {
                            if (!prev) return prev;
                            const newAlternatives = prev.alternatives
                              .filter((altId) => altId !== c.id)
                              .concat(swapFromId);

                            const newSelected = prev.selected
                              .filter((sel) => sel.id !== swapFromId)
                              .concat({
                                id: c.id,
                                reason: `Swapped with ${swapFromId}`,
                              });

                            const newEstimatedCredits = newSelected.reduce(
                              (sum, sel) => {
                                const courseObj = courseById.get(sel.id);
                                return sum + (courseObj?.credits ?? 0);
                              },
                              0
                            );
                            return {
                              ...prev,
                              alternatives: newAlternatives,
                              selected: newSelected,
                              estimatedCredits: newEstimatedCredits,
                              warnings: prev.warnings,
                            };
                          });

                          setSwapFromId(null);
                        }}
                      >
                        Swap in
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </div>
    </Container>
  );
}

export default Schedule;
