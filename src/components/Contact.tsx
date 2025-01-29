import { toast } from "sonner";

const Contact = () => {
  const handleContact = () => {
    // Open email client with pre-filled subject
    const email = "info@braden.com.au";
    const subject = "Inquiry from Website";
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    toast.success("Opening email client...");
  };

  return (
    <section id="contact" className="bg-brand-primary text-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-montserrat font-bold text-2xl md:text-3xl lg:text-4xl mb-8">Contact Us</h2>
          <div className="space-y-3 font-opensans text-base md:text-lg">
            <p>5/339 Cambridge Street,</p>
            <p>WEMBLEY, WA 6014</p>
            <p>braden.com.au</p>
          </div>
          <button 
            onClick={handleContact}
            className="mt-8 bg-white text-brand-primary font-montserrat font-bold px-6 py-3 md:px-8 md:py-4 rounded-lg hover:bg-opacity-90 transition-all text-sm md:text-base"
          >
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default Contact;