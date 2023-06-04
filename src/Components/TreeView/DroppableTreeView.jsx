import './DroppableTreeView.css';
import { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useTreeViewContext } from 'contexts/TreeViewContext';
import { StrictModeDroppable } from 'components/StrictModeDroppable';
import DraggableTreeNode from './DraggableTreeNode';

// TODO: Replace StrictModeDroppable with Droppable for production

export function DroppableTreeView({ id, target, style }) {
  const treeViewContext = useTreeViewContext();
  const [nodes, setNodes] = useState([]);

  useEffect(_ => {
    if(treeViewContext.generated[0] && !target || treeViewContext.generated[1] && target)
      setNodes(getNodes());
  }, [treeViewContext.currentTree, treeViewContext.generated]);

  const getNodes = () => {
    let body = [];
    let tree = target ? treeViewContext.targetTree : treeViewContext.currentTree;

    tree.map((node, index) => {
      body.push((
        <DraggableTreeNode
          key={node.id}
          node={node}
          index={index}
          isDraggable={node.draggable}
          handleNodeClick={treeViewContext.handleNodeClick}
        />
      ))
    });

    return body;
  }

  return (
    <StrictModeDroppable droppableId={id}>
      {(provided) => (
        <ListGroup className={id} ref={provided.innerRef} {...provided.droppableProps} style={style}>
          {nodes}
          {provided.placeholder}
        </ListGroup>
      )}
    </StrictModeDroppable>
  );
}

export default DroppableTreeView;
