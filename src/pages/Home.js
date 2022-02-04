import { useState, useEffect } from "react";
import "./Home.css";
import { Container, Row, Col } from "react-bootstrap";
import { generateTreemap } from "../utils/treemap";
import { validateRowNumber, validateJson } from "../utils/validation";

const Home = () => {
  const [jsonValue, setJsonValue] = useState("");
  const [rowNumber, setRowNumber] = useState("");
  const [isJsonValueError, setIsJsonValueError] = useState(false);
  const [isRowNumberError, setIsRowNumberError] = useState(false);
  const [calculatedTreemap, setCalculatedTreemap] = useState([]);
  const [calculatedWidthWeight, setcalculatedWidthWeight] = useState(0);

  const reducer = (previousValue, currentValue) =>
    previousValue + currentValue.weight;

  useEffect(() => {
    setIsJsonValueError(false);
    setIsRowNumberError(false);
    if (!jsonValue || !rowNumber) {
      return;
    }

    const parsedRowNumber = parseInt(rowNumber, 10);
    let parsedJson = {};

    try {
      parsedJson = JSON.parse(jsonValue);
    } catch (e) {
      setIsJsonValueError(true);
      return;
    }

    if (!validateRowNumber(parsedJson, parsedRowNumber)) {
      setIsRowNumberError(true);
      return;
    }

    if (!validateJson(parsedJson)) {
      setIsJsonValueError(true);
      return;
    }

    parsedJson = parsedJson.sort((a, b) => {
      if (a.weight > b.weight) {
        return -1;
      }
      if (b.weight > a.weight) {
        return 1;
      }
      return 0;
    });

    const result = generateTreemap(parsedJson, parsedRowNumber);
    if (!result) {
      alert("unknown error");
      return;
    }

    const { widthWeight, treemap } = result;
    setcalculatedWidthWeight(widthWeight);
    setCalculatedTreemap(treemap);
  }, [jsonValue, rowNumber]);

  const onChangeRowNumber = event => {
    setRowNumber(event.target.value);
  };

  const onChangeJsonValue = event => {
    setJsonValue(event.target.value);
  };

  return (
    <div className="home">
      <div className="row">
        <div className="col-md-4 container">
          <p className="title">Data</p>
          {isJsonValueError ? (
            <span className="error"> Invaild Json </span>
          ) : null}
          <textarea
            className="textarea"
            placeholder="Enter Json Value"
            rows="10"
            value={jsonValue}
            onChange={onChangeJsonValue}
          ></textarea>
          <p className="title">Row Number</p>
          {isRowNumberError ? (
            <span className="error"> Invaild Row Number </span>
          ) : null}
          <input
            type="text"
            placeholder="Enter Row Number"
            value={rowNumber}
            onChange={onChangeRowNumber}
          />
        </div>
        <div className="col-md-8">
          <p className="title">Result</p>
          <Container>
            {calculatedTreemap.map((t, i) => (
              <Row key={i}>
                {t.map(node => (
                  <Col
                    key={node.name}
                    xs
                    lg={(node.weight / calculatedWidthWeight) * 12}
                    className={`table-cell ${node.value > 0 ? "green" : "red"}`}
                  >
                    <p className="cell-title">{node.name}</p>
                    <span>{`${node.value * 100}%`}</span>
                  </Col>
                ))}
                {calculatedWidthWeight - t.reduce(reducer, 0) > 0 ? (
                  <Col className="table-cell white"></Col>
                ) : null}
              </Row>
            ))}
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Home;
