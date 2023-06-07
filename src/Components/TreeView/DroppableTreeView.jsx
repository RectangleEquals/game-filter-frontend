import './DroppableTreeView.css';
import { ListGroup } from 'react-bootstrap';
import { StrictModeDroppable } from 'components/StrictModeDroppable';
import DraggableTreeNode from './DraggableTreeNode';

// TODO: Replace StrictModeDroppable with Droppable for production

export default function DroppableTreeView({ id, tree, onClick, style })
{
  if(!id || !tree)
    return null;

  const getNodes = () => {
    return tree.map((node, index) => (
      <DraggableTreeNode
        key={node.id}
        node={node}
        index={index}
        isDraggable={node.draggable}
        handleNodeClick={onClick}
      />
    ));
  };

  return (
    <StrictModeDroppable droppableId={id}>
      {(provided) => (
        <ListGroup className={id} ref={provided.innerRef} {...provided.droppableProps} style={style}>
          {getNodes()}
          {provided.placeholder}
        </ListGroup>
      )}
    </StrictModeDroppable>
  );
}