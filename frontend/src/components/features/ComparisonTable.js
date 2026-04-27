import React from 'react';
import Card from '../common/ui/Card';
import '../../pages/Features/GymComparison.css';

const ComparisonTable = ({ comparison }) => {
  if (!comparison || !comparison.gyms) {
    return <div>No comparison data available</div>;
  }

  const { gyms, features, summary } = comparison;

  return (
    <div className="comparison-container">
      {/* Summary Section */}
      <div className="comparison-summary">
        <h2 className="text-2xl font-bold mb-6">Comparison Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summary.map((summaryItem) => (
            <Card key={summaryItem.id} className="p-6">
              <h3 className="text-lg font-bold mb-3">{summaryItem.name}</h3>
              
              <div className="mb-4">
                <h4 className="font-semibold text-sm text-green-500 mb-2">✓ Best For</h4>
                <p className="text-sm text-textSecondary">{summaryItem.bestFor}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-sm text-accent mb-2">Pros:</h4>
                <ul className="text-sm text-textSecondary space-y-1">
                  {summaryItem.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✔</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {summaryItem.cons.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-red-500 mb-2">Cons:</h4>
                  <ul className="text-sm text-textSecondary space-y-1">
                    {summaryItem.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✘</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Gym Header Cards */}
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-6">Detailed Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {gyms.map((gym) => (
            <Card key={gym.id} className="overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                <img
                  src={gym.image}
                  alt={gym.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{gym.name}</h3>
                <p className="text-sm text-textSecondary mb-3">{gym.location}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="font-bold">{gym.rating}</span>
                  </div>
                  <span className="text-sm text-textSecondary">
                    {gym.reviews} reviews
                  </span>
                </div>
                <div className="mt-3 text-lg font-bold text-primary">
                  ₹{gym.monthlyPrice}/month
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Comparison Table */}
      {Object.keys(features).map((categoryKey) => {
        const category = features[categoryKey];
        return (
          <div key={categoryKey} className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-primary">
              {category.name}
            </h3>
            <div className="overflow-x-auto">
              <table className="comparison-table w-full">
                <thead>
                  <tr className="border-b-2 border-primary">
                    <th className="text-left py-3 px-4 font-bold">Feature</th>
                    {gyms.map((gym) => (
                      <th
                        key={gym.id}
                        className="text-center py-3 px-4 font-bold"
                      >
                        {gym.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {category.features.map((feature, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-surfaceLight hover:bg-surfaceLight/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-sm">
                        {feature.name}
                      </td>
                      {feature.values.map((val, valIdx) => (
                        <td
                          key={valIdx}
                          className={`py-3 px-4 text-center font-semibold ${
                            val.status === 'yes'
                              ? 'text-green-500'
                              : val.status === 'no'
                              ? 'text-red-500'
                              : 'text-textMain'
                          }`}
                        >
                          {val.value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Call to Action */}
      <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
        <h3 className="text-lg font-bold mb-2">Ready to make your choice?</h3>
        <p className="text-textSecondary mb-4">
          Select your preferred gym and book a trial session today.
        </p>
        <button className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
          Book Trial Now
        </button>
      </div>
    </div>
  );
};

export default ComparisonTable;
