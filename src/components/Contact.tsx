const Contact = () => {
  return (
    <section className="bg-brand-primary text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-montserrat font-bold text-2xl mb-8">Contact Us</h2>
          <div className="space-y-4 font-opensans">
            <p>5/339 Cambridge Street,</p>
            <p>WEMBLEY, WA 6014</p>
            <p>braden.com.au</p>
          </div>
          <button className="mt-8 bg-white text-brand-primary font-montserrat font-bold px-8 py-3 rounded hover:bg-opacity-90 transition-all">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default Contact;