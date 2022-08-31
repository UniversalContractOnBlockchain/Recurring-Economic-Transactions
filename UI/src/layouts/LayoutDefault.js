import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const LayoutDefault = ({ children }) => (
  <ThemeProvider theme={darkTheme}>
    <Header navPosition="right" className="reveal-from-bottom" />
    <main className="site-content">
      {children}
    </main>
    <Footer />
  </ThemeProvider>
);

export default LayoutDefault;  