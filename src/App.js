import React, { useState } from 'react';

const FinancialHeatmap = () => {
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Create the calendar data structure for December 2024
  const generateCalendarData = () => {
    // December 2024 has 31 days, starting on Sunday (day 0)
    const startDay = 0; // Sunday
    const daysInMonth = 31;
    
    // Financial data for December based on your bank statement
    const financialData = {
      // Income days - These days are dominated by income
      15: { income: true, amount: 1122.47, note: "Target Payroll - Your main income for first half of month" },
      29: { income: true, amount: 1271.18, note: "Target Payroll - Your main income for second half of month" },
      
      // Mixed days with income but emotional spending impact
      5: { happy: true, income: true, amount: 17.24, note: "Received $8 Zelle, spent on Daiso & Tesolife - Small joy purchases offset by income" },
      11: { regretful: true, income: true, amount: 123.37, note: "Received $30 Zelle, but spent $123 on various items including impulse buys" },
      13: { regretful: true, income: true, amount: 31.23, note: "Received $8 Zelle, but spent on Afterpay purchase ($31)" },
      26: { regretful: true, income: true, amount: 246.88, note: "Received $255 from Zelle payments, but spent $246 at Target and other stores - nearly wiping out the income" },
      27: { income: true, amount: 80.78, note: "Zelle from Juan - Reimbursement that offsets previous spending" },
      28: { happy: true, income: true, amount: 72.24, note: "Received $24 Zelle, spent on bakery and coffee - enjoyable purchases" },
      
      // Days with strictly necessary expenses (gas, basic bills)
      2: { fixed: true, amount: 150.89, note: "Multiple bills and essential purchases" },
      4: { fixed: true, amount: 26.74, note: "Basic necessities" },
      8: { fixed: true, amount: 17.30, note: "Apple bill and small essentials" },
      12: { fixed: true, amount: 72.84, note: "Walmart groceries and necessities" },
      20: { fixed: true, amount: 222.39, note: "Gym membership and essential bills" },
      
      // Regretful/impulse spending days
      3: { regretful: true, amount: 115.90, note: "Multiple purchases including Amazon and dining out" },
      7: { regretful: true, amount: 33.84, note: "Las Vegas Seafood - Possibly avoidable expense" },
      10: { regretful: true, amount: 41.37, note: "Gap Outlet, Dutch Bros - Shopping and coffee splurges" },
      14: { regretful: true, amount: 62.20, note: "Domino's, other impulse spending" },
      18: { regretful: true, amount: 70.12, note: "Various expenses including Zelle to Dad" },
      19: { regretful: true, amount: 166.42, note: "Amazon, Target purchases - Significant impulse buys" },
      21: { regretful: true, amount: 99.90, note: "Gap Outlet, Target purchases - More shopping" },
      22: { regretful: true, amount: 180.39, note: "Nike, Levi's, other purchases - Major shopping spree" },
      
      // Happy/worthwhile spending
      9: { happy: true, amount: 31.29, note: "Shell, dining out - Enjoyable experiences" },
      24: { happy: true, amount: 50.47, note: "In-N-Out, holiday treats - Festive enjoyment" },
      25: { happy: true, amount: 7.36, note: "Zero One Ice - Small treat" },
      
      // No-spend days
      1: { noSpend: true },
      6: { noSpend: true },
      16: { noSpend: true },
      17: { noSpend: true },
      23: { noSpend: true },
      30: { noSpend: true },
      31: { noSpend: true }
    };
    
    // Generate full calendar data
    const calendarData = [];
    let week = [];
    
    // Add empty cells for days before the 1st
    for (let i = 0; i < startDay; i++) {
      week.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = financialData[day] || { noSpend: true };
      week.push({ day, ...dayData });
      
      if ((day + startDay) % 7 === 0) {
        calendarData.push(week);
        week = [];
      }
    }
    
    // Add empty cells to complete the last week
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      calendarData.push(week);
    }
    
    return calendarData;
  };

  const calendarData = generateCalendarData();

  const handleDayMouseEnter = (event, dayData) => {
    if (!dayData) return;
    
    // Calculate position for tooltip near the cell but not covering it
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY + 5
    });
    
    let noteText = '';
    if (dayData.noSpend) {
      noteText = 'No spending today! 🎉';
    } else if (dayData.income && dayData.happy) {
      noteText = `Income + worthwhile spending: $${dayData.amount.toFixed(2)}`;
      if (dayData.note) noteText += ` - ${dayData.note}`;
    } else if (dayData.income && dayData.regretful) {
      noteText = `Income + regretful spending: $${dayData.amount.toFixed(2)}`;
      if (dayData.note) noteText += ` - ${dayData.note}`;
    } else if (dayData.income) {
      noteText = `Income: $${dayData.amount.toFixed(2)}`;
      if (dayData.note) noteText += ` - ${dayData.note}`;
    } else if (dayData.regretful) {
      noteText = `Impulse spending: $${dayData.amount.toFixed(2)}`;
      if (dayData.note) noteText += ` - ${dayData.note}`;
    } else if (dayData.happy) {
      noteText = `Worthwhile purchase: $${dayData.amount.toFixed(2)}`;
      if (dayData.note) noteText += ` - ${dayData.note}`;
    } else if (dayData.fixed) {
      noteText = `Necessary expenses: $${dayData.amount.toFixed(2)}`;
      if (dayData.note) noteText += ` - ${dayData.note}`;
    }
    
    setTooltipContent(noteText);
  };

  const handleDayMouseLeave = () => {
    setTooltipContent(null);
  };

  // Get color and style for a day based on spending type and amount
  const getDayStyle = (dayData) => {
    if (!dayData) return {
      backgroundColor: '#1f2937', // dark gray for empty cells
      backgroundImage: 'none'
    };
    
    let backgroundColor = '#374151'; // default gray
    let textColor = 'text-gray-800';
    
    const amount = dayData.amount || 0;
    let opacity = 0.5;
    
    // Set opacity based on amount
    if (amount > 500) {
      opacity = 1.0;
    } else if (amount > 100) {
      opacity = 0.9;
    } else if (amount > 50) {
      opacity = 0.8;
    } else if (amount > 20) {
      opacity = 0.7;
    } else if (amount > 10) {
      opacity = 0.6;
    } else {
      opacity = 0.5;
    }
    
    // Set base color by type
    if (dayData.income && !dayData.regretful && !dayData.happy && !dayData.fixed) {
      backgroundColor = `rgba(34, 197, 94, ${opacity})`; // green for pure income
      textColor = amount > 300 ? 'text-white' : 'text-gray-800';
    } else if (dayData.income && dayData.happy) {
      backgroundColor = `rgba(74, 222, 128, ${opacity})`; // light green for income + worthwhile
      textColor = 'text-gray-800';
    } else if (dayData.income && dayData.regretful) {
      backgroundColor = `rgba(248, 113, 113, ${opacity})`; // light red for income + regretful
      textColor = amount > 100 ? 'text-white' : 'text-gray-800';
    } else if (dayData.regretful) {
      backgroundColor = `rgba(239, 68, 68, ${opacity})`; // red for regretful
      textColor = amount > 50 ? 'text-white' : 'text-gray-800';
    } else if (dayData.happy) {
      backgroundColor = `rgba(250, 204, 21, ${opacity})`; // yellow for happy
      textColor = 'text-gray-800';
    } else if (dayData.fixed) {
      backgroundColor = `rgba(156, 163, 175, ${opacity})`; // gray for fixed
      textColor = amount > 100 ? 'text-white' : 'text-gray-800';
    }
    
    // Stripe pattern for no-spend days
    if (dayData.noSpend) {
      return {
        backgroundColor: '#f3f4f6', // light gray base
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #9ca3af 5px, #9ca3af 10px)',
        textColor: 'text-gray-800'
      };
    }
    
    return {
      backgroundColor,
      backgroundImage: 'none',
      textColor
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg">
      <h1 className="text-3xl font-bold text-white mb-4">Financial Awareness Calendar</h1>
      <h2 className="text-xl text-gray-200 mb-6">December 2024</h2>
      
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={index} className="text-gray-400 text-sm font-medium text-center p-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarData.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((day, dayIndex) => {
                const dayStyle = getDayStyle(day);
                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`relative h-20 rounded-md flex flex-col items-center justify-center transition-colors duration-200 ease-in-out hover:ring-2 hover:ring-blue-400`}
                    style={{
                      backgroundColor: dayStyle.backgroundColor,
                      backgroundImage: dayStyle.backgroundImage
                    }}
                    onMouseEnter={(e) => handleDayMouseEnter(e, day)}
                    onMouseLeave={handleDayMouseLeave}
                  >
                    {day && (
                      <>
                        <span className={`text-lg font-bold ${dayStyle.textColor}`}>
                          {day.day}
                        </span>
                        {day.amount > 0 && (
                          <span className={`text-xs mt-1 font-semibold ${dayStyle.textColor}`}>
                            ${day.amount > 999 ? (day.amount / 1000).toFixed(1) + 'k' : day.amount.toFixed(0)}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-6 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center">
          <div className="w-6 h-6 mr-2 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}></div>
          <span className="text-gray-200 text-sm">Regretful/Impulse</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 mr-2 rounded" style={{ backgroundColor: 'rgba(250, 204, 21, 0.8)' }}></div>
          <span className="text-gray-200 text-sm">Worthwhile/Happy</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 mr-2 rounded" style={{ backgroundColor: 'rgba(156, 163, 175, 0.8)' }}></div>
          <span className="text-gray-200 text-sm">Fixed/Necessary</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 mr-2 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.8)' }}></div>
          <span className="text-gray-200 text-sm">Income</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 mr-2 rounded" style={{ 
            backgroundColor: '#f3f4f6',
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #9ca3af 5px, #9ca3af 10px)'
          }}></div>
          <span className="text-gray-200 text-sm">No-Spend Day</span>
        </div>
      </div>
      
      {/* Tooltip */}
      {tooltipContent && (
        <div 
          className="absolute z-10 bg-gray-800 text-white p-2 rounded shadow-lg text-sm"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            maxWidth: '250px'
          }}
        >
          {tooltipContent}
        </div>
      )}
      
      {/* Summary Section */}
      <div className="mt-8 bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">Monthly Insights</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• 2 major paydays (15th, 29th) with significant income</li>
          <li>• 11 days with regretful/impulse spending - including 3 days with both income and regrets</li>
          <li>• Only 5 days with truly necessary expenses (bills, essentials)</li>
          <li>• 7 no-spend days - celebrating financial restraint!</li>
          <li>• Highest spending day: Dec 22 (Nike, Levi's shopping spree)</li>
          <li>• Mixed emotional days: When you received money but also spent impulsively</li>
          <li>• Pattern: Income days often followed by impulse spending days</li>
        </ul>
      </div>
    </div>
  );
};

function App() {
  return <FinancialHeatmap />;
}

export default App;