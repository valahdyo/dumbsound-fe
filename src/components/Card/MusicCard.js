import { Col, Card } from "react-bootstrap"
export default function MusicCard({ item, index, handlePlay }) {
  let title = String(item.title)
  if (title.length > 12) {
    title = title.slice(0, 11) + " ..."
  }

  return (
    <Col className="mb-3">
      <Card
        onClick={() => handlePlay(index)}
        key={index}
        bg="secondary"
        className="mb-2 p-2"
        style={{
          cursor: "pointer",
          minHeight: "100%",
        }}
      >
        <Card.Img
          className="thumbnail-img"
          variant="top"
          src={item.thumbnail}
        />
        <Card.Body className="ps-0 pt-2 pb-0">
          <Card.Title className="d-flex justify-content-between">
            <div className="f-18 fw-700 light-color">{title}</div>
            <div className="f-14 fw-400 light-color">{item.year}</div>
          </Card.Title>
          <Card.Text className="f-14 fw-400 light-color">
            {item.artist?.name}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
}
