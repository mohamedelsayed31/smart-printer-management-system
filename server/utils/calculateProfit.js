const calculateProfit = (sellingPrice, cost) => {
    // ممكن مستقبلاً تضيف هنا حسابات تانية زي الضرايب
    return sellingPrice - cost;
  };
  module.exports = calculateProfit;