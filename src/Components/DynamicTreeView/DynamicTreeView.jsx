import './DynamicTreeView.css';
import { useState, useEffect, Fragment } from 'react';
import { Container, ListGroup, Row, Col, Form } from 'react-bootstrap';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import ImageAsset from 'components/ImageAsset';

export default function DynamicTreeView({ jsonData, maxHeight = 500, showKeyColumn = true, config = null }) {
  const [data, setData] = useState(jsonData);
  const [parentDataStack, setParentDataStack] = useState([]);
  const [animateDirection, setAnimateDirection] = useState(null);
  const [showSearchFilter, setShowSearchFilter] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [filteredData, setFilteredData] = useState(jsonData);
  const [expanded, setExpanded] = useState({});

  useEffect(_ => {
    if (searchFilter) {
      const filtered = filterData(data, searchFilter);
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
    updateSearchVisibility();
  }, [data, searchFilter]);

  const handleExpand = (key) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [key]: !prevExpanded[key],
    }));
  };

  const handleClick = (value) => {
    if (typeof value === 'object') {
      setParentDataStack([...parentDataStack, data]);
      setData(value);
      setAnimateDirection('slide-in-right');
      setSearchFilter('');
    }
  };

  const handleGoBack = () => {
    if (parentDataStack.length > 0) {
      const parentData = parentDataStack[parentDataStack.length - 1];
      const updatedStack = parentDataStack.slice(0, parentDataStack.length - 1);
      setParentDataStack(updatedStack);
      setData(parentData);
      setAnimateDirection('slide-in-left');
      setSearchFilter('');
    }
  };

  const handleAnimationEnd = () => {
    setAnimateDirection(null);
  };

  const handleSearchFilterChange = (event) => {
    setSearchFilter(event.target.value);
  };

  const clearSearchFilter = () => {
    setSearchFilter('');
  };

  const updateSearchVisibility = () => {
    let showFilter = true;
    if(config && config.visibleSearchThreshold && data) {
      let elementCount = 0;
      if(Array.isArray(data)) {
        elementCount = data.length;
      } else if(typeof data === 'object') {
        elementCount = Object.keys(data).length;
      } else {
        elementCount = 1;
      }
      showFilter = elementCount >= config.visibleSearchThreshold
    }
    setShowSearchFilter(showFilter);
  }

  const renderValue = (key, value) => {
    if (value === undefined || value === null) {
      return null;
    }

    if (Array.isArray(value))
    {
      if (value.length < 1) return null;

      const icon = config && getConfigIcon(key);
      return (
        <Container key={key} className="animate fade-in">
          <Row>
            {icon && (
              <Col xs="auto" className="tree-icon-column">{icon}</Col>
            )}
            <Col>
              <strong>{key}</strong>
            </Col>
            <Col xs="auto" onClick={() => handleExpand(key)}>
              {expanded[key] ? <BsChevronDown /> : <BsChevronRight />}
            </Col>
          </Row>
          {expanded[key] && (
            <Container>
              {value.map((item, index) => {
                const itemKey = `${key}.${index}`;
                return (
                  <Fragment key={itemKey}>
                    {renderValue(itemKey, item)}
                  </Fragment>
                );
              })}
            </Container>
          )}
        </Container>
      );
    }
  
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value);
      if (entries.length < 1) return null;
      const icon = config && getConfigIcon(key);
  
      return (
        <Container key={key} className="animate fade-in">
          <Row>
            {icon && (
              <Col xs="auto" className="tree-icon-column">{icon}</Col>
            )}
            <Col>
              <strong>{key}</strong>
            </Col>
            <Col xs="auto" onClick={() => handleExpand(key)}>
              {expanded[key] ? <BsChevronDown /> : <BsChevronRight />}
            </Col>
          </Row>
          {expanded[key] && (
            <Container>
              {entries.map(([nestedKey, nestedValue]) => {
                const nestedItemKey = `${key}.${nestedKey}`;
                return (
                  <Fragment key={nestedItemKey}>
                    {renderValue(nestedItemKey, nestedValue)}
                  </Fragment>
                );
              })}
            </Container>
          )}
        </Container>
      );
    }
  
    const icon = config && getConfigIcon(key);
    return (
      <Container key={key} className="animate fade-in">
        <Row>
          {icon && (
            <Col xs="auto" className="tree-icon-column">{icon}</Col>
          )}
          <Col>
            <strong>{key}:</strong> {value}
          </Col>
        </Row>
      </Container>
    );
  };

  const filterData = (data, searchFilter) => {
    // Implement your filtering logic here
    // You can modify this function based on your specific requirements
    return data;
  };

  const getConfigIcon = (value) => {
    if (!config || !config.paths) {
      return null;
    }

    for (const { key, icon } of config.paths) {
      if (matchesPath(value, key)) {
        return (
          <ImageAsset className={`asset-${icon} div-tree-icon-div img-tree-icon-image div-show-border`} />
        );
      }
    }

    return null;
  };

  const matchesPath = (value, xpath) => {
    // Split the xpath into individual keys
    const keys = xpath.split('.');
  
    // Start traversing the value object using the keys
    let currentValue = value;
    for (const key of keys) {
      // Check if the current key exists in the value object
      if (currentValue.hasOwnProperty(key)) {
        // Update the current value to the nested value
        currentValue = currentValue[key];
      } else {
        // If any key is not found, return false
        return false;
      }
    }
  
    // If the traversal is successful and the current value is truthy, return true
    return Boolean(currentValue);
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
        {showSearchFilter &&
          <ListGroup.Item>
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  value={searchFilter}
                  placeholder="Search"
                  onChange={handleSearchFilterChange}
                />
              </Col>
              {searchFilter && (
                <Col xs="auto" className="close-icon" onClick={clearSearchFilter}>
                  <AiOutlineClose />
                </Col>
              )}
            </Row>
          </ListGroup.Item>
        }
        {filteredData &&
          Object.entries(filteredData).map(([key, value]) => {
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
