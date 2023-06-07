import './DroppableTreeView.css';
import { StrictModeDroppable } from 'components/StrictModeDroppable';
import { ListGroup } from 'react-bootstrap';
import DraggableTreeNode from './DraggableTreeNode';

// TODO: Replace StrictModeDroppable with Droppable for production

export default function DroppableTreeView({ id, style, context }) {
  const tree = id.endsWith(".target") ? context.targetTree : context.currentTree;

  const getNodes = () => {
    return tree.map((node, index) => (
      <DraggableTreeNode
        key={node.id}
        node={node}
        index={index}
        isDraggable={node.draggable}
        handleNodeClick={context.handleNodeClick}
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