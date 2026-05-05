import React from 'react';
import './TagList.css';

export const Tag = ({ children, variant = 'dark' }) => {
  return (
    <span className={`vacancy-tag vacancy-tag-${variant}`}>
      {children}
    </span>
  );
};

const TagList = ({ tags = [] }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="tag-list-container">
      {tags.map((tag, index) => {
        const isString = typeof tag === 'string';
        const label = isString ? tag : tag.label;
        const variant = isString ? 'dark' : (tag.variant || 'dark');
        
        return (
          <Tag key={index} variant={variant}>
            {label}
          </Tag>
        );
      })}
    </div>
  );
};

export default TagList;
