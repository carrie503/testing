import { useState, useEffect } from 'react';
import { PowerSet } from 'js-combinatorics'
import './Home.css';
import { Container, Row, Col } from 'react-bootstrap';

const Home = () => {
  const [jsonValue, setJsonValue] = useState('')
  const [rowNumber, setRowNumber] = useState('')
  const [calculatedTreemap, setCalculatedTreemap] = useState([])
  const [calculatedWidthWeight, setcalculatedWidthWeight] = useState(0)

  const reducer = (previousValue, currentValue) => previousValue + currentValue.weight;

  useEffect(() => {
    const parsedRowNumber = parseInt(rowNumber, 10)
    let parsedJson = {}

    try {
      parsedJson = JSON.parse(jsonValue)
      if (!Array.isArray(parsedJson)) {
        console.error("not array")
        return;
      }
    } catch(e) {
      console.log(e)
      console.error("cannot parse")
      return;
    }

    if (!Number.isInteger(parsedRowNumber)) {
      console.error("not integer")
      return;
    }

    if (parsedJson.length < parsedRowNumber) {
      console.error('rownumber large')
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
    })

    console.log('parsedJson', parsedJson)

    let numSum = 0;

    for (const node of parsedJson) {
      numSum += node.weight
    }
    console.log(numSum)

    let weightJson = [...parsedJson];

    const treemap = []

    for (let i = 0; i < parsedRowNumber; i++){
      treemap[i] = []
    }
    treemap[0].push(weightJson.shift())

    while (treemap[0].reduce(reducer, 0) * parsedRowNumber < numSum && weightJson.length > 0) {
      const lastItem = weightJson.pop();
      treemap[0].push(lastItem);
    }

    const widthWeight = treemap[0].reduce(reducer, 0)
    console.log('widthWeight', widthWeight)


    for (let i = 1; i < parsedRowNumber; i++) {
      const powerset = new PowerSet(weightJson)
      const combinations = [...powerset].filter(c => c.length > 0);
      const scores = {};
      for (const c of combinations) {
        let score = (c.reduce(reducer, 0) / widthWeight) * 100;
        if (score > 100) {
          score = 0;
        }
        if (!scores[score]) {
          scores[score] = []
        }
        scores[score].push(c)
      }

      console.log('scores', scores)

      let highestScore = 0
      for (const s in scores) {
        const currentScore = parseFloat(s)
        if (currentScore > highestScore) {
          highestScore = currentScore;
        }
      }

      console.log('highest score', highestScore)

      if (scores[highestScore].length === 0) {
        console.error("no score")
        return;
      }

      treemap[i] = scores[highestScore][0];

      for (const node of scores[highestScore][0]) {
        weightJson = weightJson.filter(w => w.name !== node.name);
      }
    }

    console.log('map', treemap)
    setcalculatedWidthWeight(widthWeight);
    setCalculatedTreemap(treemap);

  }, [jsonValue, rowNumber])

  const onChangeRowNumber = (event) => {
    setRowNumber(event.target.value);
  }

  const onChangeJsonValue = (event) => {
    setJsonValue(event.target.value);
  }

  return (
    <div className="home">
      <div className="row">
        <div className="col-md-4 container">
          <p className="title">Data</p>
          <textarea className="textarea" rows="10" value={jsonValue} onChange={onChangeJsonValue}></textarea>
          <p className="title">Row Number</p>
          <input type="text" value={rowNumber} onChange={onChangeRowNumber}/>
        </div>
        <div className="col-md-8">
          <p className="title">Result</p>
          <Container>
            {/* <Row>
              <Col xs lg="12" className="table-cell green">
                1 of 1
              </Col>
            </Row>
            <Row>
              <Col xs lg="6" className="table-cell">
                2 of 1
              </Col>
              <Col xs lg="6" className="table-cell">
                2 of 2
              </Col>
            </Row>
            <Row>
              <Col xs lg="6" className="table-cell">
                3 of 1
              </Col>
              <Col xs lg="4" className="table-cell">
                3 of 2
              </Col>
              <Col xs lg="2" className="table-cell">
                3 of 3
              </Col>
            </Row> */}
            {
              calculatedTreemap.map((t) => (
                <Row>
                  {t.map((node) => (
                    <Col xs lg={ (node.weight / calculatedWidthWeight) * 12} className={`table-cell ${node.value > 0 ? "green" : "red"}`}>
                      <p className="cell-title">{node.name}</p>
                      <span>{`${node.value * 100}%`}</span>
                    </Col>
                  ))}
                  {calculatedWidthWeight - t.reduce(reducer, 0) > 0 ? (
                    <Col className="table-cell white">
                    </Col>
                  ) : null}
                </Row>
              ))
            }
          </Container>
        </div>
      </div>
    </div>
  );
}

export default Home;