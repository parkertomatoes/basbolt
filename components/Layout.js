import Editor from './Editor';
import AsmView from './AsmView';
import Help from './Help';
import DockLayout from 'rc-dock';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import 'rc-dock/dist/rc-dock.css';

const defaultLayout = {
  dockbox: {
    id: 'root',
    mode: 'horizontal',
    children: [
      {
        tabs: [
          {id: 'editor'}
        ]
      }, {
        tabs: [
          {id: 'asm'}
        ]
      }
    ]
  }
};

export default function Layout() {
  const [layout, setLayout] = useState(defaultLayout);
  const article = useSelector(({ article }) => article);
  const dockLayout = useRef(null);

  const loadTab = ({ id }) => {
    switch(id) {
      case 'editor':
        return {
          id,
          cached: true,
          title: 'editor',
          content: <Editor defaultSource={`PRINT "HELLO WORLD!"`} />
        }
      
      case 'asm':
        return {
          id,
          title: 'asm',
          content: <AsmView />
        };

      case 'help':
        return {
          id, 
          title: 'help',
          closable: true,
          content: <Help />
        }
    }
  };

  useEffect(() => {
    // if the article changes and the help screen isn't visible, open it
    if (article && dockLayout.current) 
      if (!dockLayout.current.find('help'))
        dockLayout.current.dockMove(loadTab({ id: 'help' }), 'root', 'top')
  }, [article]);

  return (
    <DockLayout 
      loadTab={loadTab}
      layout={layout} 
      ref={dockLayout}
      dropMode="edge" 
      onLayoutChange={newLayout => { setLayout(newLayout); }}
    />
  );
}