import { createContext, useContext } from 'react';

type PageLoadingContextValue = { reportModelSettled: () => void };
export const PageLoadingContext = createContext<PageLoadingContextValue | null>(null);
export const usePageLoading = () => useContext(PageLoadingContext);
