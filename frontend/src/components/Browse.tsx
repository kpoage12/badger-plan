import Class from "./Class";
import classes from "../data/data";

function Browse() {
  return (
    <div className="d-flex gap-3 overflow-auto pb-3">
      {classes.map((c) => (
        <Class
          key={c.name}
          name={c.name}
          subtitle={c.subtitle}
          credits={c.credits}
        />
      ))}
    </div>
  );
}

export default Browse;
