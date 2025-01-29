import { ContactForm } from "./ContactForm";

const Contact = () => {
  return (
    <section id="contact" className="bg-brand-primary text-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-montserrat font-bold text-2xl md:text-3xl lg:text-4xl mb-8 text-center">Contact Us</h2>
          <div className="space-y-3 font-opensans text-base md:text-lg text-center mb-8">
            <p>5/339 Cambridge Street,</p>
            <p>WEMBLEY, WA 6014</p>
            <p>braden.com.au</p>
          </div>
          <div className="bg-white rounded-lg p-6 md:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;