import './DynamicTreeView.css';
import { useState, useEffect, Fragment } from 'react';
import { Container, ListGroup, Row, Col, Form } from 'react-bootstrap';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import useAuthContext from "components/AuthContext/AuthContext";
import ImageAsset from 'components/ImageAsset';

const defaultMaxHeight = 500;

export default function DynamicTreeView({ jsonData, showKeyColumn = true, config = null }) {
  const authContext = useAuthContext();
  const [data, setData] = useState(jsonData);
  const [parentDataStack, setParentDataStack] = useState([]);
  const [animateDirection, setAnimateDirection] = useState(null);
  const [showSearchFilter, setShowSearchFilter] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [filteredData, setFilteredData] = useState(jsonData);
  const [expanded, setExpanded] = useState({});
  const [hoveredElement, setHoveredElement] = useState(null);

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

  const handleClick = (value, key) => {
    if (typeof value === 'object') {
      const parentPath = parentDataStack.length > 0 ? parentDataStack[parentDataStack.length - 1].key : '';
      const thisPath = parentPath ? `${parentPath}.${key}` : key;
      setParentDataStack([...parentDataStack, { data, parentPath: parentPath, key: thisPath }]);
      setData(value);
      setAnimateDirection('slide-in-right');
      setSearchFilter('');
    }
  };

  const handleGoBack = () => {
    if (parentDataStack.length > 0) {
      const { data: parentData, key: parentKey } = parentDataStack[parentDataStack.length - 1];
      const updatedStack = parentDataStack.slice(0, parentDataStack.length - 1);
      setParentDataStack(updatedStack);
      setData(parentData);
      setAnimateDirection('slide-in-left');
      setSearchFilter('');
  
      if (parentKey) {
        const parentParentPath = updatedStack.length > 0 ? updatedStack[updatedStack.length - 1].path : '';
        const path = parentParentPath ? `${parentParentPath}.${parentKey}` : parentKey;
        setParentDataStack((prevStack) => {
          const updatedParentDataStack = [...prevStack];
          if(updatedParentDataStack[updatedParentDataStack.length - 1])
            updatedParentDataStack[updatedParentDataStack.length - 1].path = path;
          return updatedParentDataStack;
        });
      }
    }
  };

  const handleAnimationEnd = () => {
    setAnimateDirection(null);
  };

  const handleSearchFilterChange = (event) => {
    setSearchFilter(event.target.value);
  };
  
  const filterData = (data, searchFilter) => {
    // TODO: Implement filtering logic here
    return data;
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

  const renderValue = (key, value) =>
  {
    if (value === undefined || value === null) {
      return null;
    }

    const parentPath = parentDataStack[parentDataStack.length - 1]?.key;
    const path = parentPath ? `${parentPath}.${key}` : key;

    // Apply matching path rules from the config
    const icon = applyPathRules(path, value);

    // Use the ImageAsset component with the appropriate className for the icon
    const iconComponent = icon ? (
      <ImageAsset className={`asset-${icon} div-tree-icon-div img-tree-icon-image div-show-border`} />
    ) : null;
  
    if (Array.isArray(value)) {
      if (value.length < 1) return null;

      return (
        <Container
          key={path}
          className={`animate fade-in ${hoveredElement === path && authContext.debugMode ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredElement(path)}
          onMouseLeave={() => setHoveredElement(null)}
          aria-label={authContext.debugMode ? path : ''}>
          <Row>
            {iconComponent && <Col xs="auto" className="tree-icon-column">{iconComponent}</Col>}
            <Col>
              <strong>{key}</strong>
            </Col>
            <Col xs="auto" onClick={() => handleExpand(key)}>
              {expanded[key] ? null : <BsChevronRight />}
            </Col>
          </Row>
        </Container>
      );
    }
  
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value);
      if (entries.length < 1) return null;
  
      return (
        <Container
          key={path}
          className={`animate fade-in ${hoveredElement === path && authContext.debugMode ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredElement(path)}
          onMouseLeave={() => setHoveredElement(null)}
          aria-label={authContext.debugMode ? path : ''}>
          <Row>
            {iconComponent && <Col xs="auto" className="tree-icon-column">{iconComponent}</Col>}
            <Col>
              <strong>{key}</strong>
            </Col>
            <Col xs="auto" onClick={() => handleExpand(key)}>
              {expanded[key] ? null : <BsChevronRight />}
            </Col>
          </Row>
        </Container>
      );
    }
  
    return (
      <Container
        key={path}
        className={`animate fade-in ${hoveredElement === path && authContext.debugMode ? 'hovered' : ''}`}
        onMouseEnter={() => setHoveredElement(path)}
        onMouseLeave={() => setHoveredElement(null)}
        aria-label={authContext.debugMode ? path : ''}>
        <Row>
          {iconComponent && <Col xs="auto" className="tree-icon-column">{iconComponent}</Col>}
          <Col>
            <strong>{key}:</strong> {value}
          </Col>
        </Row>
      </Container>
    );
  };

  const applyPathRules = (path, value) => {
    let icon = null;
  
    if (config && config.paths) {
      // Iterate over each rule in the config.paths array
      for (const rule of config.paths) {
        if (matchesPathRule(path, value, rule)) {
          // If the rule matches the path and value, update the icon
          icon = rule.icon;
        }
      }
    }
  
    return icon;
  };
  
  const matchesPathRule = (path, value, rule) => {
    const pathKeys = path.split('.');
  
    // Check if the rule's key matches the path
    const ruleKeys = rule.key ? rule.key.split('.') : [];
    if (ruleKeys.length > pathKeys.length) {
      return false;
    }
  
    for (let i = 0; i < ruleKeys.length; i++) {
      const ruleKey = ruleKeys[i];
      const pathKey = pathKeys[i];
  
      // Handle wildcard (*) and wildcard with prefix (key.*)
      if (ruleKey !== '*' && !ruleKey.endsWith('.*') && ruleKey !== pathKey) {
        return false;
      }
    }
  
    // Check if the rule's value matches the value (if specified)
    if (rule.value !== undefined && rule.value !== value) {
      return false;
    }
  
    return true;
  };

  return (
    <Container>
      <ListGroup style={{ maxHeight: `${config.maxHeight || defaultMaxHeight}px`, overflowY: 'auto', overflowX: 'hidden' }}>
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
        {filteredData && Object.entries(filteredData).map(([key, value]) => {
          const renderedValue = renderValue(key, value);
          return renderedValue && (
            <ListGroup.Item
              key={key}
              onClick={() => handleClick(value, key)}
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