import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import { useState, useEffect } from 'react';

const RichTextEditor = ({ content, onChange, placeholder = "Write your review..." }) => {
  const [users, setUsers] = useState([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          items: ({ query }) => {
            return users
              .filter(user => user.name.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 5);
          },
          render: () => {
            let component;
            let popup;

            return {
              onStart: (props) => {
                component = document.createElement('div');
                component.className = 'mention-suggestions';
                
                popup = document.createElement('div');
                popup.className = 'bg-white border rounded-lg shadow-lg p-2 max-h-40 overflow-y-auto';
                component.appendChild(popup);
                
                document.body.appendChild(component);
              },
              onUpdate(props) {
                const { items, command } = props;
                
                popup.innerHTML = '';
                
                if (items.length === 0) {
                  const div = document.createElement('div');
                  div.className = 'p-2 text-gray-500';
                  div.textContent = 'No users found';
                  popup.appendChild(div);
                  return;
                }
                
                items.forEach((item, index) => {
                  const div = document.createElement('div');
                  div.className = `p-2 cursor-pointer hover:bg-gray-100 ${index === props.selectedIndex ? 'bg-gray-100' : ''}`;
                  div.textContent = item.name;
                  div.onclick = () => command({ id: item.id, label: item.name });
                  popup.appendChild(div);
                });
              },
              onKeyDown(props) {
                if (props.event.key === 'Escape') {
                  component.remove();
                  return true;
                }
                return false;
              },
              onExit() {
                if (component) {
                  component.remove();
                }
              },
            };
          },
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[100px] p-3 border rounded-md',
      },
    },
  });

  // Mock users for mention - in real app, fetch from API
  useEffect(() => {
    setUsers([
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
      { id: '3', name: 'Mike Johnson' },
    ]);
  }, []);

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 bg-gray-50">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded text-sm ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded text-sm ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
          >
            Italic
          </button>
          <span className="text-xs text-gray-500 ml-auto">Type @ to mention users</span>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;