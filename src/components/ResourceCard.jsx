import React from 'react';

const ResourceCard = ({ title, icon: Icon, links, colorClass }) => {
  return (
    
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
        
      <div className={`flex items-center gap-3 ${colorClass} mb-6`}>
        <Icon size={28} />
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      </div>
      <ul className="space-y-4">
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.url} className={`${colorClass} font-semibold hover:underline flex items-center gap-2`}>
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
    
  );
};

export default ResourceCard;