import { createContext, useContext, useState } from 'react';

export const TreeViewContext = createContext();

export function TreeViewProvider({ treeData, children })
{
  const [history, setHistory] = useState([]); // An object keeping track of the history of both trees
  const [currentTree, setCurrentTree] = useState(treeData);
  
  const handleNodeClick = (node) => {
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
        history,
        setHistory,
        currentTree,
        setCurrentTree,
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