import { createBrowserHistory } from 'history'
import project from '../configs/project';
export default createBrowserHistory({
  basename:project.base+'/'
  /* pass a configuration object here if needed */
})