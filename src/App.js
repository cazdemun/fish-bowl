import React, { useState } from "react";
import { Row, Column } from "./UI";

const Screen = ({ children }) => (
  <Column className="w-screen h-screen bg-empty">{children}</Column>
);

const Header = ({ children }) => (
  <Row className="w-full center-x bg-primary-dark font-bold text-white">
    {children}
  </Row>
);

// const Sidebar = ({ children }) => (
//   <Column className="h-full w-4/12 min-width-200 center-y center-x bg-secondary">
//     {children}
//   </Column>
// );

const Content = ({ children }) => (
  <Column className="w-full h-full center-x center-y py-10 bg-primary">
    {children}
  </Column>
);

const Footer = ({ children }) => (
  <Row className="w-full center-x bg-primary-light font-bold">{children}</Row>
);

const probability = n => !!n && Math.random() <= n;

function randomInt(mi, ma) {
  const min = Math.ceil(mi);
  const max = Math.floor(ma);
  return Math.floor(Math.random() * (max - min)) + min;
}

// maybe exp
const drawSlip = () =>
  new Promise((resolve, reject) => {
    if (probability(0.45)) {
      resolve(0);
    }
    if (probability(0.95)) {
      resolve(randomInt(1, 21));
    } else {
      resolve(100);
    }
  });

const createRegister = points =>
  new Promise((resolve, reject) => {
    const date = new Date();
    resolve({
      point: points,
      timestamp: Date.now(),
      // date: date.toString(),
      date: dateToString(date),
      metadata: ""
    });
  });

const HistoryTable = ({ data = [], setHistory }) => (
  <table className="w-full">
    <thead className="w-full">
      <tr>
        <th>Date</th>
        <th>Metadata</th>
        <th>Points</th>
      </tr>
    </thead>
    <tbody className="w-full">
      {data.map((r, i) => (
        <tr className="w-full">
          <td>{r.date}</td>
          {/* <td>{r.metadata}</td> */}
          <td>
            <input
              value={r.metadata}
              onChange={e => {
                console.log(e.target.value);
                const newHistory = [...data];
                newHistory[i].metadata = e.target.value;
                setHistory(newHistory);
              }}
            />
          </td>
          <td>{r.point !== 0 ? r.point : "Keep up the good work."}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const dateToString = d => {
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);

  const h = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "numeric"
  }).format(d);

  return `${da}-${mo}-${ye} ${h}`;
};

export default function App() {
  const [exp, setExp] = useState(0);
  const [lastSlip, setLastSlip] = useState(0);
  const [history, setHistory] = useState([]);

  return (
    <Screen>
      <Header>Fish Bowl (Beta)</Header>
      <Row className="sidebar-content w-full h-full">
        {/* <Sidebar>Sidebar</Sidebar> */}
        <Content>
          <Column className="panels flex-none center-x w-full h-full center-y">
            <Column className="left-panel bg-empty w-3/4 center-x mb-5">
              <h2 className="bg-secondary-dark w-full p-3 text-center text-white font-bold mb-3">
                Left Panel
              </h2>
              <h2>Current exp:</h2>
              {exp}
              <h2>Last slip:</h2>
              <p className="text-center break-all">{lastSlip}</p>
              <Row className="w-full center-x">
                <button
                  className="bg-secondary mx-3 mb-5 mt-3 px-5 py-2 font-bold"
                  onClick={() =>
                    drawSlip()
                      .then(maybePoints => {
                        if (maybePoints === 0) {
                          setLastSlip("Keep up the good work!");
                        } else {
                          setLastSlip(maybePoints);
                          setExp(exp + maybePoints);
                        }
                        return createRegister(maybePoints);
                      })
                      .then(newRegister => {
                        setHistory([...history, newRegister]);
                      })
                      .catch(err => console.log(err))
                  }
                >
                  Draw a slip!
                </button>
                <button
                  className="bg-secondary mx-3 mb-5 mt-3 px-5 py-2 font-bold"
                  onClick={() => {
                    setHistory([]);
                    setExp(0);
                    setLastSlip(0);
                  }}
                >
                  Clear
                </button>
              </Row>
            </Column>
            <Column className="right-panel bg-empty whitespace-normal w-3/4 center-x overflow-y-hidden max-h-full">
              <h2 className="bg-secondary-dark p-3 w-full text-center text-white font-bold">
                History
              </h2>
              <div className="w-full overflow-y-auto max-h-full">
                {/* <p className="break-all p-5">{JSON.stringify(history)}</p> */}
                <HistoryTable data={history} setHistory={setHistory} />
              </div>
            </Column>
          </Column>
        </Content>
      </Row>
      <Footer>cazdemun / anurbanlion</Footer>
    </Screen>
  );
}
