import { Draggable } from 'react-beautiful-dnd';
import { ListGroup } from 'react-bootstrap';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';

export function DraggableTreeNode({ node, index, handleNodeClick })
{
  const handleClick = () => {
    if (node.children) {
      handleNodeClick(node);
    }
  };

  return (
    node.isBack || node.isHeader ? (
      <ListGroup.Item
        variant='dark'
        style={
          node.isBack ? {cursor: 'pointer', display: 'flex', alignItems: 'center'} :
          {alignItems: 'center'}
        }
        onClick={node.isBack ? handleClick : _ => {}}>
          {node.isBack && <MdArrowBackIos style={{ marginRight: '0.5rem' }} />}
          {node.icon && <span>{node.icon}</span>}
          {node.isBack ? (<span><strong>{node.title}</strong></span>) : <span>{node.title}</span>}
      </ListGroup.Item>
    ) : (
      <Draggable key={node.id} draggableId={node.id} index={index} isDragDisabled={!node.isDraggable}>
        {(provided, snapshot) => (
          <ListGroup.Item
            className="d-flex flex-grow-1 flex-row justify-content-start align-items-center"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              cursor: node.isDraggable ? 'grab' : 'pointer',
              backgroundColor: snapshot.isDragging ? 'lightblue' : 'white',
            }}
            onClick={!node.isDraggable ? handleClick : _ => {}}>
            {node.icon}
            <span>{node.title}</span>
            {node.children && 
              <div className="ms-auto">
                <MdArrowForwardIos className='float-end'/>
              </div>
            }
          </ListGroup.Item>
        )}
      </Draggable>
    )
  );
}

export default DraggableTreeNode;