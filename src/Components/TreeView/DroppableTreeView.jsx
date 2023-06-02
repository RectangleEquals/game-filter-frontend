import './DroppableTreeView.css';
import { DragDropContext } from 'react-beautiful-dnd';
import { ListGroup } from 'react-bootstrap';
import { useTreeViewContext } from 'contexts/TreeViewContext';
import { StrictModeDroppable } from 'components/StrictModeDroppable';
import DraggableTreeNode from './DraggableTreeNode';

// TODO: Replace StrictModeDroppable with Droppable for production

export function DroppableTreeView({ id, children }) {
  const treeViewContext = useTreeViewContext();

  const createBackNode = () => {
    if (treeViewContext.history.length > 0) {
      /* Creates a new node specifically for this "back"
        element, which should be tied to the parent node */
      const previousTree = treeViewContext.history[treeViewContext.history.length - 1];
      const parentNode = previousTree.tree[previousTree.parentIndex];
      return {
        id: `${parentNode.id}.back`,
        icon: parentNode.icon,
        title: parentNode.title, // Use the parent node's title for the back button
        children: [], // A back button shouldn't have any children
      };
    }
    return {};
  };

  return (
    <DragDropContext onDragEnd={treeViewContext.handleDragEnd}>
      <StrictModeDroppable droppableId={id}>
        {(provided) => (
          <ListGroup
            className={id}
            ref={provided.innerRef}
            {...provided.droppableProps}>
            
            {children}

            {treeViewContext.history.length > 0 && (
              <DraggableTreeNode
                key={`${treeViewContext.history[treeViewContext.history.length - 1].id}.back`}
                node={createBackNode()}
                isBack={true}
                handleNodeClick={treeViewContext.handleGoBack}
              />
            )}

            {treeViewContext.currentTree.map((node, index) => (
              <DraggableTreeNode
                key={node.id}
                node={node}
                index={index}
                isHeader={node.header}
                isDraggable={!node.header && Boolean(!node.children)}
                handleNodeClick={treeViewContext.handleNodeClick}
              />
            ))}
            {provided.placeholder}
          </ListGroup>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
}

export default DroppableTreeView;
