import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  return (
    <Link to={`/useful_materials/article/${article.id}`} style={{ textDecoration: "none" }}>
      <div style={{
        border: "1px solid #ddd",
        padding: "20px",
        marginBottom: "20px",
        background: "#fff"
      }}>
        <h2>{article.title}</h2>

        <div style={{ color: "#777", marginBottom: "10px" }}>
          {article.tags.join(" • ")}
        </div>

        <p>{article.excerpt}</p>

        <div style={{ fontSize: "14px", color: "#999" }}>
          👁 {article.views} • {article.date}
        </div>
      </div>
    </Link>
  );
}