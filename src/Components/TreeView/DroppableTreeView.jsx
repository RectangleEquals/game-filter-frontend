import './DroppableTreeView.css';
import { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { ListGroup } from 'react-bootstrap';
import { StrictModeDroppable } from 'components/StrictModeDroppable';
import DraggableTreeNode from './DraggableTreeNode';

// TODO: Replace StrictModeDroppable with Droppable for production

export function DroppableTreeView({ treeData, id, children }) {
  const [currentTree, setCurrentTree] = useState(treeData);
  const [history, setHistory] = useState([]);
  const [animationDirection, setAnimationDirection] = useState(null); // Animation direction state

  const handleNodeClick = (node) => {
    setHistory((prevHistory) => [
      ...prevHistory,
      { tree: currentTree, parentIndex: currentTree.findIndex((element) => element.id === node.id) },
    ]);
    setAnimationDirection('forward'); // Set the animation direction to forward
    setCurrentTree(node.children);
  };

  const handleGoBack = () => {
    if (history.length > 0) {
      const { tree, parentIndex } = history.pop();
      setAnimationDirection('backward'); // Set the animation direction to backward
      setCurrentTree(tree);
    }
  };

  const handleDragEnd = (result) => {
    console.log(JSON.stringify(result));
  };

  const createBackNode = () => {
    if (history.length > 0) {
      /* Creates a new node specifically for this "back"
        element, which should be tied to the parent node */
      const previousTree = history[history.length - 1];
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <StrictModeDroppable droppableId={id}>
        {(provided) => (
          <ListGroup
            className={id}
            ref={provided.innerRef}
            {...provided.droppableProps}>
            
            {children}

            {history.length > 0 && (
              <DraggableTreeNode
                key={`${history[history.length - 1].id}.back`}
                node={createBackNode()}
                isBack={true}
                handleNodeClick={handleGoBack}
              />
            )}

            {currentTree.map((node, index) => (
              <DraggableTreeNode
                key={node.id}
                node={node}
                index={index}
                isHeader={node.header}
                isDraggable={!node.header && Boolean(!node.children)}
                handleNodeClick={handleNodeClick}
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
