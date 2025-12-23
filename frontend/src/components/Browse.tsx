import Class from "./Class";
import classes from "../data/data";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SearchInput, { createFilter } from "react-search-input";
import { useState } from "react";

function Browse() {
  const FILTER_KEYS = ["name", "subtitle"];
  const [search, setSearch] = useState("");

  const filtered = classes.filter(createFilter(search, FILTER_KEYS));

  return (
    <>
      <SearchInput
        className="courseSearch"
        onChange={setSearch}
        placeholder="Search courses (Comp Sci 400...)"
      />
      <Container>
        <Row>
          {filtered.map((c) => (
            <Col key={c.name} xs={12} sm={12} md={6} lg={4} xl={3}>
              <Class name={c.name} subtitle={c.subtitle} credits={c.credits} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Browse;
