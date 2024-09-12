import React, { useState } from 'react';
import LaunchNavigator from './src/navigations/launch';
import { ThemeContext } from './src/contexts/theme.context';

const App = () => {
  const [appTheme, setAppTheme] = useState(null);

  return (
    <ThemeContext.Provider value={{ appTheme, setAppTheme }}>
      <LaunchNavigator />
    </ThemeContext.Provider>
  );
}

export default App;
