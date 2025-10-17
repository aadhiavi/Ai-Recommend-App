import ProductCard from "./ProductCard";

export default function ProductList({ title, items, highlightedNames = [] }) {

    const lowerSet = new Set(highlightedNames.map(n => n.toLowerCase()));
    
    return (
        <div className="product-list p-4 sm:p-6 bg-white rounded-xl shadow-lg h-full">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 border-b pb-2 text-gray-700">
                {title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto max-h-[80vh]">
                {items.map(p => (
                    <ProductCard
                        key={p.id}
                        product={p}
                        highlighted={lowerSet.has(p.name.toLowerCase())}
                    />
                ))}
            </div>
        </div>
    );
}
