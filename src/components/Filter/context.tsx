import { createContext, ReactNode, useContext } from 'react';

interface IFilterContext {
  active?: boolean;
  title: string;
  onRemoveFilter?: () => void;
}

const FilterContext = createContext<IFilterContext | undefined>(undefined);

export const FilterProvider = ({
  active,
  title,
  onRemoveFilter,
  children,
}: IFilterContext & { children: ReactNode }) => (
  <FilterContext.Provider value={{ active, title, onRemoveFilter }}>
    {children}
  </FilterContext.Provider>
);

/** Filter.Chip/Filter.Dropdown은 Filter 안에서만 쓰이므로 context가 항상 있다. */
export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('Filter 하위에서만 사용할 수 있습니다.');
  }
  return context;
};
