import React, { useRef, useEffect } from 'react';
import { useLocation, Switch } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';
import ReactGA from 'react-ga';

// Layouts
import LayoutDefault from './layouts/LayoutDefault';

// Views 
import Home from './views/Home';
import Contracts from './views/Contracts'
import SingleContract from './views/SingleContract';
import CreateContract from './views/CreateContract';
import ExplorerList from './views/ExplorerList'
import ExplorerElement from './views/ExplorerElement'
import ProposedContracts from './views/ProposedContracts'
import SingleProposedContract from './views/SingleProposedContract'


// Initialize Google Analytics
ReactGA.initialize(process.env.REACT_APP_GA_CODE);

const trackPage = page => {
  ReactGA.set({ page });
  ReactGA.pageview(page);
};

const App = () => {

  const childRef = useRef();
  let location = useLocation();

  useEffect(() => {
    const page = location.pathname;
    document.body.classList.add('is-loaded')
    childRef.current.init();
    trackPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
        <Switch>
          <AppRoute exact path="/" component={Home} layout={LayoutDefault} />
          <AppRoute exact path="/contracts" component={Contracts} layout={LayoutDefault} />
          <AppRoute exact path="/proposed-contracts" component={ProposedContracts} layout={LayoutDefault} />
          <AppRoute exact path="/proposed-contracts/:id" component={SingleProposedContract} layout={LayoutDefault} />
          <AppRoute exact path="/contracts/:address" component={SingleContract} layout={LayoutDefault} />
          <AppRoute exact path="/new-contract" component={CreateContract} layout={LayoutDefault} />
          <AppRoute exact path="/explorer-contracts" component={ExplorerList} layout={LayoutDefault} />
          <AppRoute exact path="/explorer/:address" component={ExplorerElement} layout={LayoutDefault} />
        </Switch>
      )} />
  );
}

export default App;