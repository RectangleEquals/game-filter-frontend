import { Draggable } from 'react-beautiful-dnd';
import { ListGroup } from 'react-bootstrap';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';

export function DraggableTreeNode({ node, index, isDraggable, isBack, handleNodeClick }) {
  const handleClick = () => {
    if (node.children) {
      handleNodeClick(node);
    }
  };

  return (
    isBack ? (
      <ListGroup.Item
        variant='dark'
        style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}}
        onClick={handleClick}>
          <MdArrowBackIos style={{ marginRight: '0.5rem' }} />
          {node.icon && <span>{node.icon}</span>}
          <span><strong>{node.title}</strong></span>
      </ListGroup.Item>
    ) : (
      <Draggable key={node.id} draggableId={node.id} index={index} isDragDisabled={!isDraggable}>
        {(provided, snapshot) => (
          <ListGroup.Item
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              cursor: isDraggable ? 'grab' : 'pointer',
              backgroundColor: snapshot.isDragging ? 'lightblue' : 'white',
            }}
            onClick={!isDraggable ? handleClick : () => {}}>
            {node.icon}
            <span>{node.title}</span>
            {node.children && <MdArrowForwardIos className="float-right" />}
          </ListGroup.Item>
        )}
      </Draggable>
    )
  );
}

export default DraggableTreeNode;