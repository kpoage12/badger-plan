import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import Modal from "react-bootstrap/esm/Modal";
import type { CsCourse } from "../../../shared/types/course";

function Class({ code, title, credits }: CsCourse) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Card className="mt-2" style={{ width: "18rem" }}>
      <Card.Body>
        <div>
          <Card.Title className="mb-1">{code}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{title}</Card.Subtitle>
          <Card.Text className="fw-semibold">{credits} credits</Card.Text>
        </div>
        <Button
          variant="outline-primary"
          className="mt-2 w-100"
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
              <Modal.Title>{code}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {title}
              <br />
              {credits} credits
            </Modal.Body>

            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Class;
