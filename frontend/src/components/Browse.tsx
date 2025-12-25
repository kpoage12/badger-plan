import Class from "./Class";
import csCourses from "../data/data";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SearchInput, { createFilter } from "react-search-input";
import { useState } from "react";

function Browse() {
  const FILTER_KEYS = ["code", "title"];
  const [search, setSearch] = useState("");

  const filtered = csCourses.filter(createFilter(search, FILTER_KEYS));

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
            <Col key={c.id} xs={12} sm={12} md={6} lg={4} xl={3}>
              <Class {...c} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Browse;
