import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCustomer, usePricingTable } from "autumn-js/react";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { CheckCircle2, Sparkles } from "lucide-react";

interface AvailablePlansProps {
  userId: string;
}

export function AvailablePlans({ userId }: AvailablePlansProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const { attach } = useCustomer();

  const { products } = usePricingTable();

  const handleSubscribe = async (productId: string) => {
    try {
      setLoadingPlan(productId);
      await attach({ productId, successUrl: window.location.href });
    } catch (error) {
      console.error("Failed to attach product:", error);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage({ type: 'error', text: 'Please enter a coupon code' });
      return;
    }

    try {
      setCouponLoading(true);
      setCouponMessage(null);

      const response = await apiClient.coupons.validate.$post({
        json: { code: couponCode.trim() }
      });

      const data = await response.json();

      if (response.ok && 'success' in data && data.success) {
        setCouponMessage({ 
          type: 'success', 
          text: data.message || 'Coupon applied successfully!'
        });
        setCouponCode('');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setCouponMessage({ 
          type: 'error', 
          text: 'message' in data ? data.message : 'Invalid or already used coupon code'
        });
      }
    } catch (error) {
      setCouponMessage({ 
        type: 'error', 
        text: 'Failed to validate coupon. Please try again.'
      });
    } finally {
      setCouponLoading(false);
    }
  };

  if (!products?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Loading subscription options...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const monthlyPlan = products.find(p => p.id === 'monthly');
  const yearlyPlan = products.find(p => p.id === 'yearly');
  const lifetimePlan = products.find(p => p.id === 'lifetime');

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="text-3xl">Choose Your Plan</CardTitle>
          </div>
          <CardDescription className="text-base">
            All plans include full access to every feature
          </CardDescription>
        </CardHeader>
        <CardContent className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {monthlyPlan && (
              <Card className="border-2 hover:border-primary/50 transition-all">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{monthlyPlan.name}</CardTitle>
                  <div className="mt-4">
                    <div className="text-4xl font-bold">$100</div>
                    <div className="text-sm text-muted-foreground mt-1">per month</div>
                    <Badge variant="secondary" className="mt-2">5-day free trial</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(monthlyPlan.id)}
                    disabled={!userId || loadingPlan === monthlyPlan.id}
                  >
                    {loadingPlan === monthlyPlan.id ? "Processing…" : "Start Free Trial"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {yearlyPlan && (
              <Card className="border-2 border-primary shadow-lg relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Best Value</Badge>
                </div>
                <CardHeader className="text-center pb-4 pt-6">
                  <CardTitle className="text-xl">{yearlyPlan.name}</CardTitle>
                  <div className="mt-4">
                    <div className="text-4xl font-bold">$500</div>
                    <div className="text-sm text-muted-foreground mt-1">per year</div>
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400 mt-2">
                      Save $700!
                    </div>
                    <Badge variant="secondary" className="mt-2">5-day free trial</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(yearlyPlan.id)}
                    disabled={!userId || loadingPlan === yearlyPlan.id}
                  >
                    {loadingPlan === yearlyPlan.id ? "Processing…" : "Start Free Trial"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {lifetimePlan && (
              <Card className="border-2 hover:border-primary/50 transition-all">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{lifetimePlan.name}</CardTitle>
                  <div className="mt-4">
                    <div className="text-4xl font-bold">$1,000</div>
                    <div className="text-sm text-muted-foreground mt-1">one-time payment</div>
                    <Badge variant="secondary" className="mt-2">Forever access</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(lifetimePlan.id)}
                    disabled={!userId || loadingPlan === lifetimePlan.id}
                  >
                    {loadingPlan === lifetimePlan.id ? "Processing…" : "Get Lifetime Access"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mt-8 pt-8 border-t">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2 text-center">Have a Coupon Code?</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Enter your coupon code below to get lifetime free access
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="AILAWYER-FREE-XXX"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  disabled={couponLoading}
                  className="font-mono"
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                >
                  {couponLoading ? "Validating..." : "Apply"}
                </Button>
              </div>
              {couponMessage && (
                <Alert className={`mt-4 ${couponMessage.type === 'success' ? 'border-green-500' : ''}`}>
                  <AlertDescription className={couponMessage.type === 'success' ? 'text-green-600 dark:text-green-400' : ''}>
                    {couponMessage.text}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const features = [
  "AI Legal Advisor",
  "Legal Research Engine",
  "Document Drafting",
  "Case Management",
  "Background Checks",
  "Knowledge Base",
  "Self-Rep Guides",
  "Court Procedures",
];
