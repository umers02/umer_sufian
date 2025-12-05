// DOM utility functions
const DOM = {
    createElement: (tag, className = '', innerHTML = '') => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },
    
    clearContent: (selector) => {
        const element = document.querySelector(selector);
        if (element) element.innerHTML = '';
    },
    
    render: (selector, content) => {
        const element = document.querySelector(selector);
        if (element) element.innerHTML = content;
    }
};