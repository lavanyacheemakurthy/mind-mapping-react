import { Card, Col, Row } from "react-bootstrap";
import css from "./tableview.module.css";

function TableView(props) {
  return (
    <div className={css.container}>
      <table className={css.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Level</th>
            <th>RootId</th>
            <th>ParentId</th>
            <th>Display Shape</th>
            <th>Condition</th>
            <th>Inputs</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {console.log("Nodes list : ", JSON.stringify(props.list))}
          {props.list.map((item, index) => (
            <tr
              key={item.id}
              onClick={() => props.onClick(item.id)}
              className={
                (index % 2 ? css.odd : css) +
                " " +
                (item.id === props.id ? css.selected : "")
              }
            >
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.level}</td>
              <td>{item.rootId}</td>
              <td>{item.parentId}</td>
              <td>{item.displayShape}</td>
              <td>{item.condition}</td>
              <td>{<InputsListCell list={item.inputsList} />}</td>
              <td>{item.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function InputsListCell(props) {
  return (
    <>
      {props?.list?.length > 0 && (
        <Card>
          {props?.list?.map((item) => (
            <div
              style={{
                padding: "3px",
                borderBottom: "1px solid rgba(27, 94, 32, .1)",
              }}
            >
              <Row>
                <Col xs={4} style={{ color: "blue" }}>
                  {item.key}:
                </Col>{" "}
                <Col xs={8} style={{ wordBreak: "break-all", color: "blue" }}>
                  {item.value}
                </Col>
              </Row>
            </div>
          ))}
        </Card>
      )}
    </>
  );
}

export default TableView;
