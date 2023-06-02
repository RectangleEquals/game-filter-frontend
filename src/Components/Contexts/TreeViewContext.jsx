import { createContext, useContext } from 'react';

export const TreeViewContext = createContext();

export function TreeViewProvider({ children })
{
  const [history, setHistory] = useState([]); // An object keeping track of the history of both trees
  const [currentTree, setCurrentTree] = useState(treeData);

  return (
    <TreeViewContext.Provider
      value={{
        history,
        setHistory,
        currentTree,
        setCurrentTree
      }}
    >
      {children}
    </TreeViewContext.Provider>
  );
}

export const useTreeViewContext = () => useContext(TreeViewContext);
export default useTreeViewContext;