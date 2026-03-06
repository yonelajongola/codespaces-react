const {
  getRevenueToday,
  getOrdersTodayCount,
  getRevenueLast7Days,
  getTopItems,
  getStaffPerformance
} = require("../models/dashboardModel");
const { getLowStock, getInventoryValue } = require("../models/inventoryModel");
const { generateDailyInsight } = require("../services/aiInsights");

async function revenueToday(req, res) {
  const revenue = await getRevenueToday(req.user.restaurantId);
  return res.json({ revenue });
}

async function ordersToday(req, res) {
  const count = await getOrdersTodayCount(req.user.restaurantId);
  return res.json({ count });
}

async function revenueLast7Days(req, res) {
  const data = await getRevenueLast7Days(req.user.restaurantId);
  return res.json({ data });
}

async function topItems(req, res) {
  const items = await getTopItems(req.user.restaurantId);
  return res.json({ items });
}

async function staffPerformance(req, res) {
  const staff = await getStaffPerformance(req.user.restaurantId);
  return res.json({ staff });
}

async function inventorySummary(req, res) {
  const lowStock = await getLowStock(req.user.restaurantId);
  const value = await getInventoryValue(req.user.restaurantId);
  return res.json({ lowStock, value });
}

async function aiSummary(req, res) {
  const restaurantId = req.user.restaurantId;
  const [revenueTodayValue, revenueDays, items, lowStock] = await Promise.all([
    getRevenueToday(restaurantId),
    getRevenueLast7Days(restaurantId),
    getTopItems(restaurantId),
    getLowStock(restaurantId)
  ]);

  const yesterday = revenueDays.length >= 2 ? revenueDays[revenueDays.length - 2].revenue : 0;
  const topItem = items[0]?.item_name || "Unknown";
  const lowStockNames = lowStock.map((row) => row.ingredient).slice(0, 3).join(", ") || "None";

  const insight = await generateDailyInsight({
    today: revenueTodayValue,
    yesterday,
    topItem,
    lowStock: lowStockNames
  });

  return res.json({ insight });
}

async function forecastNextDay(req, res) {
  const revenueDays = await getRevenueLast7Days(req.user.restaurantId);
  const values = revenueDays.map((row) => row.revenue);
  const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  return res.json({ forecast: Number(average.toFixed(2)) });
}

module.exports = {
  revenueToday,
  ordersToday,
  revenueLast7Days,
  topItems,
  staffPerformance,
  inventorySummary,
  aiSummary,
  forecastNextDay
};
