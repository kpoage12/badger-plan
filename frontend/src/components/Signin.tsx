import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { Navigate, useNavigate } from "react-router-dom";

import type { SessionUser } from "../services/session";
import { persistUserState, signIn } from "../services/session";

type SigninProps = {
  sessionUser: SessionUser | null;
  onSignedIn: (user: SessionUser) => void;
};

function Signin({ sessionUser, onSignedIn }: SigninProps) {
  const navigate = useNavigate();
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
      const user = await signIn({ email, password });
      persistUserState(user);
      onSignedIn(user);
      navigate("/builder/completed-courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="py-5">
      <Card style={{ maxWidth: 560 }} className="mx-auto">
        <Card.Body className="p-4 p-md-5">
          <h1 className="h3 mb-2">Sign in to BadgerPlan</h1>
          <p className="text-muted mb-4">
            Access your saved courses, preferences, and schedules.
          </p>

          {error ? (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          ) : null}

          <Form onSubmit={handleSubmit}>
            <Stack gap={3}>
              <Form.Group controlId="signinEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="student@wisc.edu"
                  required
                />
              </Form.Group>

              <Form.Group controlId="signinPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                  minLength={8}
                  required
                />
              </Form.Group>

              <Button type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </Stack>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Signin;
