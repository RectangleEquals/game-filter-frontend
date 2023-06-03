import './DroppableTreeView.css';
import { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { DragDropContext } from 'react-beautiful-dnd';
import { useTreeViewContext } from 'contexts/TreeViewContext';
import { StrictModeDroppable } from 'components/StrictModeDroppable';
import DraggableTreeNode from './DraggableTreeNode';

// TODO: Replace StrictModeDroppable with Droppable for production

export function DroppableTreeView({ id }) {
  const treeViewContext = useTreeViewContext();
  const [nodes, setNodes] = useState([]);

  useEffect(_ => {
    if(treeViewContext.generated)
      setNodes(getNodes());
  }, [treeViewContext.currentTree, treeViewContext.generated]);

  const getNodes = () => {
    let body = [];

    treeViewContext.currentTree.map((node, index) => {
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
    <DragDropContext onDragEnd={treeViewContext.handleDragEnd}>
      <StrictModeDroppable droppableId={id}>
        {(provided) => (
          <ListGroup className={id} ref={provided.innerRef} {...provided.droppableProps}>
            {nodes}
            {provided.placeholder}
          </ListGroup>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
}

export default DroppableTreeView;
