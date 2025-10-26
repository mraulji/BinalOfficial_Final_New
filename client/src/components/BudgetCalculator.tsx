import { useState, useEffect } from "react";
import { Plus, Minus, Send, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getServices, STORAGE_KEYS } from "@/lib/data";
import { sendBudgetEmail } from "@/lib/emailService";
import type { Service, BudgetPlannerEntry } from "@shared/schema";

export function BudgetCalculator() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Record<string, number>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    additionalNotes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load initial services
    setServices(getServices());

    // Listen for localStorage changes for services
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === STORAGE_KEYS.SERVICES) {
        setServices(e.detail.value);
      }
    };

    window.addEventListener('localStorage-update', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('localStorage-update', handleStorageChange as EventListener);
    };
  }, []);

  const updateQuantity = (serviceId: string, delta: number) => {
    setSelectedServices((prev) => {
      const current = prev[serviceId] || 0;
      const newValue = Math.max(0, current + delta);
      if (newValue === 0) {
        const { [serviceId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [serviceId]: newValue };
    });
  };

  const calculateTotal = () => {
    return Object.entries(selectedServices).reduce((total, [serviceId, quantity]) => {
      const service = services.find((s) => s.id === serviceId);
      return total + (service?.basePrice || 0) * quantity;
    }, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(selectedServices).length === 0) {
      toast({
        title: "No services selected",
        description: "Please select at least one service",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in your name and email",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare services for budget entry
      const servicesForBudget = Object.entries(selectedServices)
        .map(([serviceId, quantity]) => {
          const service = services.find((s) => s.id === serviceId);
          if (!service) return null;
          return {
            serviceId: service.id,
            serviceName: service.name,
            quantity,
            unitPrice: service.basePrice,
            totalPrice: service.basePrice * quantity,
          };
        })
        .filter(Boolean);

      // Create budget entry for admin panel
      const budgetEntry: BudgetPlannerEntry = {
        id: `budget-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
        eventDate: formData.eventDate || "",
        services: servicesForBudget,
        totalAmount: calculateTotal(),
        additionalNotes: formData.additionalNotes || "",
        status: "pending",
        submittedAt: new Date().toISOString(),
      };

      // Save to localStorage for admin panel
      const existingEntries = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGET_ENTRIES) || "[]");
      const updatedEntries = [...existingEntries, budgetEntry];
      localStorage.setItem(STORAGE_KEYS.BUDGET_ENTRIES, JSON.stringify(updatedEntries));
      
      // Dispatch event to notify admin dashboard
      window.dispatchEvent(new CustomEvent('localStorage-update', {
        detail: { key: STORAGE_KEYS.BUDGET_ENTRIES, value: updatedEntries }
      }));

      // Send email notification
      try {
        await sendBudgetEmail({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          eventDate: formData.eventDate,
          services: servicesForBudget,
          totalAmount: calculateTotal(),
          additionalNotes: formData.additionalNotes,
        });
        console.log("Budget email sent successfully");
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't block the form submission if email fails
      }

      toast({
        title: "Quote request sent!",
        description: "We'll get back to you within 24 hours with a detailed quote.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventDate: "",
        additionalNotes: "",
      });
      setSelectedServices({});
    } catch (error) {
      console.error("Error sending quote:", error);
      toast({
        title: "Error sending request",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 sm:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
            <p className="text-sm font-mono text-primary font-medium">Budget Planner</p>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Calculate Your Package
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Select the services you need and get an instant quote. We'll send you a detailed
            proposal based on your requirements.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Service Selection */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Select Services</h3>
              {services.map((service) => {
                const quantity = selectedServices[service.id] || 0;
                return (
                  <Card key={service.id} className={quantity > 0 ? "ring-2 ring-primary" : ""}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="font-serif text-xl">{service.name}</CardTitle>
                          <CardDescription className="mt-2">{service.description}</CardDescription>
                          <p className="text-primary font-semibold mt-3">
                            {formatPrice(service.basePrice)} {service.unit}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(service.id, -1)}
                            disabled={quantity === 0}
                            data-testid={`button-decrease-${service.id}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold" data-testid={`text-quantity-${service.id}`}>
                            {quantity}
                          </span>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(service.id, 1)}
                            data-testid={`button-increase-${service.id}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>

            {/* Summary & Contact Form */}
            <div className="lg:sticky lg:top-24 h-fit space-y-6">
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Calculator className="h-5 w-5 text-primary" />
                    Quote Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(selectedServices).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No services selected</p>
                  ) : (
                    <>
                      {Object.entries(selectedServices).map(([serviceId, quantity]) => {
                        const service = services.find((s) => s.id === serviceId);
                        if (!service) return null;
                        return (
                          <div key={serviceId} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {service.name} × {quantity}
                            </span>
                            <span className="font-semibold">
                              {formatPrice(service.basePrice * quantity)}
                            </span>
                          </div>
                        );
                      })}
                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-serif text-lg font-bold">Total</span>
                          <span className="font-serif text-2xl font-bold text-primary" data-testid="text-total-price">
                            {formatPrice(calculateTotal())}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Your Details</CardTitle>
                  <CardDescription>We'll send the quote to your email</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      required
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      data-testid="input-phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Event Date</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      data-testid="input-event-date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                      placeholder="Tell us more about your requirements..."
                      rows={3}
                      data-testid="input-notes"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                    data-testid="button-submit-quote"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Request Quote
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
