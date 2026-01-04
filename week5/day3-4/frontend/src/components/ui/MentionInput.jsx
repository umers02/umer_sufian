import { useState, useRef, useEffect } from 'react';

const MentionInput = ({ value, onChange, placeholder, className }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  const fetchUsers = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/users/search?q=${encodeURIComponent(query)}`);
      const users = await response.json();
      setSuggestions(users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    onChange(text);
    setCursorPosition(cursorPos);

    // Check for @ mentions
    const beforeCursor = text.substring(0, cursorPos);
    const mentionMatch = beforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      const query = mentionMatch[1];
      setMentionQuery(query);
      fetchUsers(query);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const insertMention = (user) => {
    const beforeCursor = value.substring(0, cursorPosition);
    const afterCursor = value.substring(cursorPosition);
    
    // Replace @query with @username
    const beforeMention = beforeCursor.replace(/@\w*$/, '');
    const newText = beforeMention + `@${user.name} ` + afterCursor;
    
    onChange(newText);
    setShowSuggestions(false);
    
    // Focus back to textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const extractMentions = (text) => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      const mentionedName = match[1];
      // Find user by name from suggestions or make API call
      const user = suggestions.find(u => u.name.replace(/\s+/g, '') === mentionedName);
      if (user) {
        mentions.push(user._id);
      }
    }
    
    return mentions;
  };

  // Expose extractMentions function to parent
  useEffect(() => {
    if (onChange.extractMentions) {
      onChange.extractMentions = () => extractMentions(value);
    }
  }, [value]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={className}
        rows={3}
      />
      
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-center text-gray-500 text-sm">Searching...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((user) => (
              <button
                key={user._id}
                onClick={() => insertMention(user)}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </button>
            ))
          ) : mentionQuery && (
            <div className="p-3 text-center text-gray-500 text-sm">No users found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MentionInput;