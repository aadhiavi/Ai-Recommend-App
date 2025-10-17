export default function ProductCard({ product, highlighted }) {

    const baseClasses = "p-4 rounded-lg shadow-md bg-white border border-gray-200 transition duration-300 ease-in-out hover:shadow-lg hover:border-indigo-300";
    const highlightClasses = "shadow-xl border-2 border-indigo-500 bg-indigo-50 transform scale-[1.03]";

    return (
        <div className={`${baseClasses} ${highlighted ? highlightClasses : ""}`}>
            <h4 className={`text-lg font-bold mb-1 ${highlighted ? "text-indigo-800" : "text-gray-900"}`}>
                {product.name}
            </h4>
            {product.price != null && (
                <p className={`text-xl font-semibold ${highlighted ? "text-green-600" : "text-green-500"}`}>
                    ${product.price}
                </p>
            )}
            {product.category && (
                <p className="text-sm text-gray-500 mb-2">
                    {product.category}
                </p>
            )}
            {product.desc && (
                <p className="desc text-sm text-gray-600">
                    {product.desc}
                </p>
            )}
        </div>
    );
}