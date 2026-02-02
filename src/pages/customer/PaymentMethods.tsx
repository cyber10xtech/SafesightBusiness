import { useState } from "react";
import { ArrowLeft, CreditCard, Trash2, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const mockCards = [
  {
    id: "1",
    type: "Visa",
    last4: "4242",
    expiry: "12/2027",
    isDefault: true,
  },
  {
    id: "2",
    type: "Mastercard",
    last4: "5555",
    expiry: "8/2026",
    isDefault: false,
  },
];

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState(mockCards);

  const handleSetDefault = (cardId: string) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
  };

  const handleDelete = (cardId: string) => {
    setCards(cards.filter(card => card.id !== cardId));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Payment Methods</span>
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Saved Cards</h2>

        <div className="space-y-3 mb-4">
          {cards.map((card) => (
            <div 
              key={card.id}
              className="bg-card rounded-xl p-4 border border-border"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{card.type}</span>
                    {card.isDefault && (
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">•••• {card.last4}</p>
                  <p className="text-xs text-muted-foreground">Expires {card.expiry}</p>
                  {!card.isDefault && (
                    <button 
                      onClick={() => handleSetDefault(card.id)}
                      className="text-sm text-primary font-medium mt-1"
                    >
                      Set as default
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => handleDelete(card.id)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full gap-2 mb-6"
        >
          <Plus className="w-4 h-4" />
          Add New Card
        </Button>

        {/* Security Notice */}
        <div className="bg-success/10 rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-success">Secure Payments</h3>
            <p className="text-sm text-success/80">
              Your payment information is encrypted and stored securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
