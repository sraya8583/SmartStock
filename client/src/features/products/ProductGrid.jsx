import ProductCard from "./ProductCard";
import "./css/ProductGrid.css";

// רשת שמציגה את כל המוצרים ככרטיסים
// props: products (מערך), onEdit (callback לעריכה), onDelete (callback למחיקה), onShowHistory (callback לפתיחת היסטוריה)
function ProductGrid({ products, onEdit, onDelete, onShowHistory }) {
  if (products.length === 0) {
    return <p className="product-grid__empty">אין מוצרים להצגה.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onShowHistory={onShowHistory}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
