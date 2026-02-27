import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { Navigate, useNavigate } from "react-router-dom";

import type { SessionUser } from "../services/session";
import { persistUserState, signUp } from "../services/session";

type SignupProps = {
  sessionUser: SessionUser | null;
  onSignedUp: (user: SessionUser) => void;
};

function Signup({ sessionUser, onSignedUp }: SignupProps) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (sessionUser) {
    return <Navigate to="/builder/completed-courses" replace />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await signUp({
        name: name.trim() || undefined,
        email,
        password,
      });

      persistUserState(user);
      onSignedUp(user);
      navigate("/builder/completed-courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="py-5">
      <Card style={{ maxWidth: 560 }} className="mx-auto">
        <Card.Body className="p-4 p-md-5">
          <h1 className="h3 mb-2">Create your BadgerPlan account</h1>
          <p className="text-muted mb-4">
            Your saved courses, preferences, and generated schedules will be tied
            to this account.
          </p>

          {error ? (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          ) : null}

          <Form onSubmit={handleSubmit}>
            <Stack gap={3}>
              <Form.Group controlId="signupName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Bucky Badger"
                />
              </Form.Group>

              <Form.Group controlId="signupEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="student@wisc.edu"
                  required
                />
              </Form.Group>

              <Form.Group controlId="signupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                />
              </Form.Group>

              <Button type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </Stack>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Signup;
