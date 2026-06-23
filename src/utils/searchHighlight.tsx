import React from 'react';

/**
 * Highlights matches of a query string inside a target text.
 * Returns a React node array with matches wrapped in <mark> tags.
 */
export const highlightText = (text: string, query: string): React.ReactNode => {
  if (!query || !query.trim()) {
    return <span>{text}</span>;
  }

  const trimmedQuery = query.trim();
  const escapedQuery = trimmedQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <mark 
            key={index} 
            className="bg-amber-100 text-amber-950 font-bold px-0.5 rounded-sm"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};
