import {
  createContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { type MarkEditsType, type ViewType } from "react-diff-view";

export type AppConfiguration = {
  viewType: ViewType;
  editsType: MarkEditsType;
  language: string;
};

export type AppConfigurationContextValue = {
  configuration: AppConfiguration;
  switchViewType: (value: ViewType) => void;
};

const DEFAULT_VALUE: AppConfigurationContextValue = {
  configuration: {
    viewType: "unified",
    editsType: "block",
    language: "text",
  },
  switchViewType: () => {},
};

const DiffFileConfigurationContext = createContext(DEFAULT_VALUE);
DiffFileConfigurationContext.displayName = "DiffFileConfigurationContext";

type DiffFileProviderProps = {
  children: ReactNode;
};

export const DiffFileProvider = ({ children }: DiffFileProviderProps) => {
  const [configuration, setConfiguration] = useState(
    DEFAULT_VALUE.configuration
  );

  const switchViewType = useCallback(
    (value: ViewType) =>
      setConfiguration((prev) => ({ ...prev, viewType: value })),
    []
  );

  const contextValue = useMemo(
    () => ({
      configuration,
      switchViewType,
    }),
    [configuration, switchViewType]
  );

  return (
    <DiffFileConfigurationContext.Provider value={contextValue}>
      {children}
    </DiffFileConfigurationContext.Provider>
  );
};
