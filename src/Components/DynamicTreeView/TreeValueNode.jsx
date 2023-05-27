import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import ImageAsset from 'components/ImageAsset';

export default function TreeValueNode({ id, parent, title, icon, value, showTitle = true, isBackButton = false })
{
  const [id, setId] = useState(id);
  const [iconComponent, setIconComponent] = useState(null);
  const [parentNode, setParentNode] = useState(parent);
  const [childNodes, setChildNodes] = useState(null);
  const [cursorType, setCursorType] = useState('default');

  useEffect(_ => {
    const component = icon ? (
      icon.startsWith('http') ? (
        <div className="tree-icon-div border rounded-circle">
          <Image src={icon} className="tree-icon-image" />
        </div>
      ) : (
        <ImageAsset className={`asset-${icon} div-tree-icon-div img-tree-icon-image div-show-border`} />
      )
    ) : null;
    setIconComponent(component);
  }, [icon]);

  useEffect(_ => {
    if(childNodes && typeof childNodes === 'array' && childNodes.length > 0)
      setCursorType('pointer');
    else
      setCursorType('default');
  }, [childNodes]);

  const handleGoBack = (e) => {
    e.preventDefault();
  }

  const handleGoForward = (e) => {
    e.preventDefault();
  }

  return (
    <ListGroup.Item
      variant={isBackButton ? 'dark' : ''}
      style={{ cursor: cursorType }}>
      <Row>
        {/* Back button */}
        {isBackButton &&
          <Col xs="auto" onClick={handleGoBack}>
            <BsChevronLeft className="ml-2" />
            <strong> Back</strong>
          </Col>
        }
        {/* Icon */}
        {iconComponent &&
          <Col xs="auto" className="tree-icon-column">
            {iconComponent}
          </Col>
        }
        {/* Title */}
        {showTitle &&
          <Col>
            <strong>{title}</strong>
          </Col>
        }
        {/* Value */}
        {value &&
          <Col>
            {value}
          </Col>
        }
        {/* Forward button */}
        {!isBackButton && childNodes && childNodes.length > 0 &&
          <Col xs="auto" onClick={handleGoForward}>
            <BsChevronRight />
          </Col>
        }
      </Row>
    </ListGroup.Item>
  );
}