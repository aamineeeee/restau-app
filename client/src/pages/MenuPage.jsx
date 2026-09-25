import { useMemo } from "react";
import MenuItemCard from "../components/MenuItemCard.jsx";
import { mockMenu } from "../data/mockMenu.js";

export default function MenuPage() {
  const categories = useMemo(
    () => [...new Set(mockMenu.filter((item) => item.isAvailable).map((item) => item.category))],
    [],
  );

  return (
    <div className="content-narrow">
      <section className="page-intro menu-intro">
        <p className="eyebrow">CUISINÉ AU FIL DES SAISONS</p>
        <h1>Le menu</h1>
        <p>Des produits choisis avec soin, des assiettes faites maison.</p>
      </section>
      {categories.map((category, index) => (
        <section className="menu-category" key={category}>
          <div className="section-heading">
            <div>
              <span className="section-index">0{index + 1}</span>
              <h2>{category}</h2>
            </div>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <div className="menu-grid">
            {mockMenu
              .filter((item) => item.isAvailable && item.category === category)
              .map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}