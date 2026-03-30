import React from 'react';
import { useHomeResources } from '../contexts/HomeResourcesContext';

const ResourceCard = () => {
  const { resourceCards } = useHomeResources();

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10">
      {resourceCards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className={`flex items-center gap-3 ${card.colorClass} mb-6`}>
              <Icon size={28} />
              <h3 className="text-2xl font-bold text-gray-800">{card.title}</h3>
            </div>
            <ul className="space-y-4">
              {card.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className={`${card.colorClass} font-semibold hover:underline flex items-center gap-2`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default ResourceCard;