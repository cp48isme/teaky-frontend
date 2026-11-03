import { useContext } from 'react';
import { StatusContext, type StatusApi } from '../contexts/status';

/** The app's one status region. Pages that show a result in place can still announce it here for assistive technology. */
export function useStatus(): StatusApi {
  return useContext(StatusContext);
}
