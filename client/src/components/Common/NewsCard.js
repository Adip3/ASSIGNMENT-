import React from "react";
import { TrendingUp, Info } from "lucide-react";
import "./Common.css";

const NewsCard = () => {
  const newsItems = [
    { title: "Tech layoffs continue in 2024", time: "2h ago", readers: 1234 },
    {
      title: "AI transforms workplace dynamics",
      time: "4h ago",
      readers: 5678,
    },
    { title: "Remote work here to stay", time: "6h ago", readers: 3456 },
    { title: "Sustainability in focus", time: "1d ago", readers: 2345 },
  ];

  return (
    <div className="news-card">
      <div className="news-header">
        <h3>LinkedIn News</h3>
        <Info size={16} />
      </div>

      <div className="news-list">
        {newsItems.map((item, index) => (
          <div key={index} className="news-item">
            <TrendingUp size={14} className="news-icon" />
            <div>
              <h4>{item.title}</h4>
              <p>
                {item.time} • {item.readers.toLocaleString()} readers
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="show-more-btn">Show more</button>
    </div>
  );
};

export default NewsCard;
