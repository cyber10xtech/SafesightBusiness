import CustomerBottomNav from "@/components/layout/CustomerBottomNav";

const CustomerMessages = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-4">Messages</h1>
        <p className="text-muted-foreground text-center py-12">No messages yet</p>
      </div>
      <CustomerBottomNav />
    </div>
  );
};

export default CustomerMessages;
