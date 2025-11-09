import { feature, product, featureItem, priceItem } from "atmn";

export const all_features = feature({
  id: "all_features",
  name: "All Features Included",
  type: "boolean",
});

export const unlimited_usage = feature({
  id: "unlimited_usage",
  name: "Unlimited Usage",
  type: "boolean",
});

export const monthlyPlan = product({
  id: "monthly",
  name: "Monthly Plan",
  is_default: false,
  items: [
    priceItem({
      price: 100,
      interval: "month",
    }),
    featureItem({
      feature_id: all_features.id,
    }),
    featureItem({
      feature_id: unlimited_usage.id,
    }),
  ],
});

export const yearlyPlan = product({
  id: "yearly",
  name: "Yearly Plan",
  is_default: false,
  items: [
    priceItem({
      price: 500,
      interval: "year",
    }),
    featureItem({
      feature_id: all_features.id,
    }),
    featureItem({
      feature_id: unlimited_usage.id,
    }),
  ],
});

export const lifetimePlan = product({
  id: "lifetime",
  name: "Lifetime Plan",
  is_default: false,
  items: [
    priceItem({
      price: 1000,
      interval: "year",
    }),
    featureItem({
      feature_id: all_features.id,
    }),
    featureItem({
      feature_id: unlimited_usage.id,
    }),
  ],
});

export default {
  products: [monthlyPlan, yearlyPlan, lifetimePlan],
  features: [all_features, unlimited_usage],
};

