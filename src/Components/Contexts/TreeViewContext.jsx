import { createContext, useContext, useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

export const TreeViewContext = createContext();
export const useTreeViewContext = () => useContext(TreeViewContext);

export function TreeViewProvider({ sourceData, targetData, children })
{
  const [generated, setGenerated] = useState([false, false]);
  const [sourceTree, setSourceTree] = useState(sourceData);
  const [targetTree, setTargetTree] = useState(targetData);
  const [history, setHistory] = useState([]);

  useEffect(_ => {
    setSourceTree(generateIds(sourceData));
    setGenerated(previousGenerated => {
      return [true, previousGenerated[1]]
    });
  }, [sourceData]);

  useEffect(_ => {
    setTargetTree(generateIds(targetData));
    setGenerated(previousGenerated => {
      return [previousGenerated[0], true]
    });
  }, [targetData]);

  function generateIds(data) {
    let idCounter = 0;
  
    const traverse = (node, depth, topNode) => {
      const { children, ...rest } = node;
      let id = (idCounter++).toString();
      let isDraggable = rest.isDraggable !== undefined ? rest.isDraggable : !children || children.length < 1;

      if (topNode) {
        if (depth > 0)
          id += '.back';
        id += '.header'
        isDraggable = false;
      }

      const updatedNode = {
        id,
        ...rest,
        isDraggable,
        isTopNode: topNode,
        isBack: id.endsWith('.back') || id.endsWith('.back.header'),
        isHeader: id.endsWith('.header')
      };
  
      if (children)
        updatedNode.children = children.map((child, index) => traverse(child, depth + 1, index === 0));
  
      return updatedNode;
    };
  
    return data.map((node, index) => traverse(node, 0, index === 0));
  }

  const updateData = (newTargetTree, newSourceTree) => {
    //setGenerated([false, false]);
    setSourceTree(previousSourceTree => {
      return newSourceTree || previousSourceTree || sourceTree
    });
    setTargetTree(previousTargetTree => {
      return newTargetTree || previousTargetTree || targetTree
    });
  }

  const handleNodeClick = (node) => {
    if(node.isBack) {
      handleGoBack();
      return;
    }
    setHistory((prevHistory) => [
      ...prevHistory,
      { tree: sourceTree, parentIndex: sourceTree.findIndex((element) => element.id === node.id) },
    ]);
    setSourceTree(node.children);
  };

  const handleGoBack = () => {
    if (history.length > 0) {
      const { tree, parentIndex } = history.pop();
      setSourceTree(tree);
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    
    // Return if the item is dropped outside a droppable area
    if (!destination) {
      // TODO: Delete the item instead if it was dragged from the target tree
      return;
    }
  
    // Retrieve the dragged node from the source tree
    const draggedNode = sourceTree[source.index];
  
    // Create a copy of the target tree and insert the dragged node at the destination index
    const newTargetTree = [...targetTree, draggedNode];
  
    // Create a copy of the source tree and remove the dragged node from its original position
    const newSourceTree = [...sourceTree];
    newSourceTree.splice(source.index, 1);
  
    // Update the tree data in the context
    setSourceTree(newSourceTree);
    setTargetTree(newTargetTree);
  
    // Call the updateData function from the context to update the states
    updateData(newTargetTree, newSourceTree);
  };

  const ChildrenWithContext = () => {
    if(!generated[0] || !generated[1])
      return null;

    const childElements = children(sourceTree, targetTree, handleNodeClick);
    return childElements;
  };

  if(!generated)
    return;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <TreeViewContext.Provider
        value={{
          generated,
          sourceTree,
          targetTree,
          history,
          updateData,
          setHistory,
          handleNodeClick,
          handleGoBack,
          handleDragEnd
        }}
      >
        <ChildrenWithContext />
      </TreeViewContext.Provider>
    </DragDropContext>
  );
}

export default useTreeViewContext;