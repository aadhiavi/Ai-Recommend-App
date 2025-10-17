import { useState } from "react";
import RecommendationBox from "./Components/RecommendationBox";
import ProductList from "./Components/ProductList";
import products from "./Data/Products";

function App() {
  const [recommended, setRecommended] = useState([]);
  const recommendedNames = recommended.map(r => r.name);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-indigo-700">
        Product Recommendation (AI-integrated)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-1">
          <RecommendationBox onRecommend={setRecommended} />
        </div>
        <div className="lg:col-span-2">
          <ProductList title="Available Products" items={products} highlightedNames={recommendedNames} />
        </div>
      </div>

      {recommended.length > 0 && (
        <div className="results mt-12 pt-6 border-t-2 border-indigo-200">
          <h3 className="text-2xl font-semibold mb-4 text-indigo-800">
            AI Recommended:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommended.map((r, i) => (
              <div
                key={r.id ?? i}
                className="product-card p-4 rounded-lg shadow-xl bg-white border-2 border-indigo-400 transform transition duration-300 hover:scale-[1.02]"
              >
                <h4 className="text-lg font-bold mb-1 text-indigo-600">{r.name}</h4>
                {r.price && <p className="text-xl font-extrabold text-green-600">${r.price}</p>}
                {r.category && <p className="text-sm text-gray-500 mb-3">{r.category}</p>}

                {r.reason && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="reason text-sm italic text-gray-700 leading-snug">
                      <span className="font-semibold text-indigo-500">Reason:</span> {r.reason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;



