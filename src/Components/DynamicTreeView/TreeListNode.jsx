import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import ImageAsset from 'components/ImageAsset';

export default function TreeListNode({ id, parent, title, icon, children, showTitle = true })
{
  const [id, setId] = useState(id);
  const [iconComponent, setIconComponent] = useState(null);
  const [parentNode, setParentNode] = useState(parent);
  const [childNodes, setChildNodes] = useState(children);

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

  return (
    <Accordion>
        <Accordion.Item>
          <Accordion.Header>
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
          </Accordion.Header>
          <Accordion.Collapse>
            <Accordion.Body>
              {childNodes}
            </Accordion.Body>
          </Accordion.Collapse>
        </Accordion.Item>
    </Accordion>
  );
}