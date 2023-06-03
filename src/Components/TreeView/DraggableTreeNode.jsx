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

  // const createBackNode = () => {
  //   if (treeViewContext.history.length > 0) {
  //     /* Creates a new node specifically for this "back"
  //       element, which should be tied to the parent node */
  //     const previousTree = treeViewContext.history[treeViewContext.history.length - 1];
  //     const parentNode = previousTree.tree[previousTree.parentIndex];

  //     return {
  //       id: node.id,
  //       icon: parentNode.icon,
  //       title: parentNode.title, // Use the parent node's title for the back button
  //       children: [], // A back button shouldn't have any children
  //     };
  //   }
  //   return {};
  // };

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
            {node.children && <MdArrowForwardIos />}
          </ListGroup.Item>
        )}
      </Draggable>
    )
  );
}

export default DraggableTreeNode;