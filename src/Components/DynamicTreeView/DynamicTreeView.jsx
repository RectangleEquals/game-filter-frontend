import './DynamicTreeView.css';
import React, { useState } from 'react';
import { Container, ListGroup, Row, Col } from 'react-bootstrap';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

export default function DynamicTreeView({ jsonData, maxHeight = 500 }) {
  const [data, setData] = useState(jsonData);
  const [parentDataStack, setParentDataStack] = useState([]);
  const [animateDirection, setAnimateDirection] = useState(null);

  const handleClick = (value) => {
    if (typeof value === 'object') {
      setParentDataStack([...parentDataStack, data]);
      setData(value);
      setAnimateDirection('slide-in-right');
    }
  };

  const handleGoBack = () => {
    if (parentDataStack.length > 0) {
      const parentData = parentDataStack[parentDataStack.length - 1];
      const updatedStack = parentDataStack.slice(0, parentDataStack.length - 1);
      setParentDataStack(updatedStack);
      setData(parentData);
      setAnimateDirection('slide-in-left');
    }
  };

  const handleAnimationEnd = () => {
    setAnimateDirection(null);
  };

  const renderValue = (key, value) => {
    if (value === undefined || value === null) {
      return null;
    }
    if (Array.isArray(value)) {
      if (value.length < 1)
        return null;

      return value.map((item, index) => (
        <Container key={index} className={`animate ${animateDirection}`} onAnimationEnd={handleAnimationEnd}>
          {renderValue(index, item)}
        </Container>
      ));
    } else if (typeof value === 'object') {
      return (
        <Container key={key} className={`animate ${animateDirection}`} onAnimationEnd={handleAnimationEnd}>
          <Row>
            <Col>
              <strong>{key}</strong>
            </Col>
            <Col xs="auto">
              <BsChevronRight />
            </Col>
          </Row>
        </Container>
      );
    } else {
      return (
        <Container key={key} className="animate.fade-in" onAnimationEnd={handleAnimationEnd}>
          <strong>{key}:</strong> {value}
        </Container>
      );
    }
  };

  return (
    <Container>
      <ListGroup style={{ maxHeight: `${maxHeight}px`, overflowY: 'auto', overflowX: 'hidden' }}>
        {parentDataStack.length > 0 && (
          <ListGroup.Item
            variant='dark'
            onClick={handleGoBack}
            style={{ cursor: 'pointer' }}
          >
            <Row>
              <Col>
                <BsChevronLeft className="ml-2" />
                <strong> Back</strong>
              </Col>
            </Row>
          </ListGroup.Item>
        )}
        {data &&
          Object.entries(data).map(([key, value]) => {
            const renderedValue = renderValue(key, value);
            return renderedValue && (
              <ListGroup.Item
                key={key}
                onClick={() => handleClick(value)}
                style={{ cursor: typeof value === 'object' ? 'pointer' : 'default' }}
                className={`animate ${animateDirection}`}
                onAnimationEnd={handleAnimationEnd}
              >
                {renderedValue}
              </ListGroup.Item>
            );
          })}
      </ListGroup>
    </Container>
  );
}
