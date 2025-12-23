import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";
import SearchInput, { createFilter } from "react-search-input";
import classes from "../data/data";
import Class from "./Class";
import { useState } from "react";
import Col from "react-bootstrap/esm/Col";

function CourseSearch({ courses }: { courses: any[] }) {
  const KEYS_TO_FILTERS = ["name", "subtitle"];
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCourses = courses.filter(
    createFilter(searchTerm, KEYS_TO_FILTERS)
  );
  return (
    <div>
      <SearchInput
        className="search-input"
        onChange={(term) => setSearchTerm(term)}
      />
      <Row className="g-4 mt-3">
        {filteredCourses.map((c) => (
          <Col key={c.name} xs={12} sm={6} md={4} lg={3}>
            <Class {...c} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default CourseSearch;
