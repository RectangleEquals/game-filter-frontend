import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

export const TreeViewContext = createContext();
export const useTreeViewContext = () => useContext(TreeViewContext);

export function TreeViewProvider({ treeData, targetData, children })
{
  const context = useTreeViewContext();
  const providerRef = useRef(null);
  const [generated, setGenerated] = useState([false, false]);
  const [currentTree, setCurrentTree] = useState(treeData);
  const [targetTree, setTargetTree] = useState(targetData);
  const [history, setHistory] = useState([]);

  useEffect(_ => {
    setCurrentTree(generateIds(treeData));
    setGenerated(previousGenerated => {
      return [true, previousGenerated[1]]
    });
  }, [treeData]);

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
    setGenerated([false, false]);
    setCurrentTree(previousCurrentTree => {
      return newSourceTree || previousCurrentTree || currentTree
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
      { tree: currentTree, parentIndex: currentTree.findIndex((element) => element.id === node.id) },
    ]);
    setCurrentTree(node.children);
  };

  const handleGoBack = () => {
    if (history.length > 0) {
      const { tree, parentIndex } = history.pop();
      setCurrentTree(tree);
    }
  };

  const handleRegenerate = (id) => {
    console.log(`[REGEN]: ${id}`);
  }

  const handleDragEnd = (result) => {
    console.log("[DROPPED]");
  };

  const ChildrenWithContext = () => {
    if(!generated[0] || !generated[1])
      return null;
      
    const childElements = children({currentTree, targetTree, handleNodeClick, handleRegenerate});
    return childElements;
  };

  if(!generated)
    return;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <TreeViewContext.Provider
        ref={providerRef}
        value={{
          providerRef,
          generated,
          currentTree,
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