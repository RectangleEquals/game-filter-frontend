import { useEffect } from 'react';
import { createContext, useContext, useState } from 'react';

export const TreeViewContext = createContext();

export function TreeViewProvider({ treeData, children })
{
  const [generated, setGenerated] = useState(false);
  const [currentTree, setCurrentTree] = useState(treeData);
  const [history, setHistory] = useState([]);

  useEffect(_ => {
    setCurrentTree(generateIds(treeData));
    setGenerated(true);
  }, [treeData]);

  function generateIds(treeData) {
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
  
    return treeData.map((node, index) => traverse(node, 0, index === 0));
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

  const handleDragEnd = (result) => {
    console.log(JSON.stringify(result));
  };

  return (
    <TreeViewContext.Provider
      value={{
        generated,
        currentTree,
        history,
        setCurrentTree,
        setHistory,
        handleNodeClick,
        handleGoBack,
        handleDragEnd
      }}
    >
      {children}
    </TreeViewContext.Provider>
  );
}

export const useTreeViewContext = () => useContext(TreeViewContext);
export default useTreeViewContext;