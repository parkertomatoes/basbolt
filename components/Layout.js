import Editor from './Editor';
import AsmView from './AsmView';
import DockLayout from 'rc-dock';
import { useState, useEffect, useRef } from 'react';
import 'rc-dock/dist/rc-dock.css';

const defaultLayout = {
    dockbox: {
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
    const editorParent = useRef(null);

    useEffect(() => {
        editorParent.current = document.getElementById('editor');
    })

    const loadTab = ({ id }) => {
        switch(id) {
            case 'files':
                return {
                    id,
                    title: 'files',
                    content: <div>Hello</div>
                };
            
            case 'editor':
                return {
                    id,
                    cached: true,
                    title: 'editor',
                    content: <Editor 
                                parentDomNode={editorParent.current} 
                                defaultSource={`PRINT "HELLO WORLD!"`}
                            />
                }
            
            case 'asm':
                return {
                    id,
                    title: 'asm',
                    content: <AsmView />
                };
        }
    };

    return (
        <DockLayout 
            loadTab={loadTab}
            layout={layout} 
            dropMode="edge" 
            onLayoutChange={newLayout => { setLayout(newLayout); }}
        />
    );
}