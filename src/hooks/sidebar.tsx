import React from 'react';

interface Documentation {
  id: string;
  title: string;
  slug: string;
}

export interface Macro {
  id: string;
  title: string;
  documentations: Documentation[];
}

interface SidebarContextData {
  macros: Macro[];
  updateSidebar(mascros: Macro[]): void;
  addMacro(macro: Macro): void;
  addDocumentation(id: string, documentation: Documentation): void;
  removeMacro(id: string): void;
  removeDocumentation(id: string): void;
}

interface SidebarProviderProps {
  children: React.ReactElement;
}

const SidebarContext = React.createContext<SidebarContextData>(
  {} as SidebarContextData,
);

function SidebarProvider({ children }: SidebarProviderProps) {
  const [macros, setMacros] = React.useState<Macro[]>([]);

  const updateSidebar = (macros: Macro[]) => {
    setMacros(macros);
  };

  const addMacro = React.useCallback(
    (macro: Macro) => {
      const macroAlreadyExists = macros.find(
        (currentMacro) => currentMacro.id === macro.id,
      );
      !macroAlreadyExists && setMacros([...macros, macro]);
    },
    [macros],
  );

  const removeMacro = React.useCallback(
    (id: string) => {
      const tempMacros = macros;
      tempMacros.forEach((macro, macroIndex) => {
        macro.id === id && tempMacros.splice(macroIndex, 1);
      });
      setMacros([...tempMacros]);
    },
    [macros],
  );

  const addDocumentation = React.useCallback(
    (id: string, documentation: Documentation) => {
      const tempMacros: Macro[] = macros;
      tempMacros.forEach((macro) => {
        if (macro.id === id) {
          const documentationAlreadyExists = macro.documentations.find(
            (currentDocumention) => currentDocumention.id === documentation.id,
          );
          !documentationAlreadyExists &&
            macro.documentations.push(documentation);
        }
      });
      setMacros([...tempMacros]);
    },
    [macros],
  );

  const removeDocumentation = React.useCallback(
    (id: string) => {
      const tempMacros = macros;
      tempMacros.forEach((macro, macroIndex) => {
        macro.documentations.forEach((documentation, documentationIndex) => {
          documentation.id === id &&
            tempMacros[macroIndex].documentations.splice(documentationIndex, 1);
        });
      });
      setMacros([...tempMacros]);
    },
    [macros],
  );

  return (
    <SidebarContext.Provider
      value={{
        macros,
        updateSidebar,
        addMacro,
        removeMacro,
        addDocumentation,
        removeDocumentation,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

function useSidebar(): SidebarContextData {
  return React.useContext(SidebarContext);
}

export { SidebarProvider, useSidebar };
