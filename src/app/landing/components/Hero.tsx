const Hero = () => {
  return (
      <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-4">
              <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">Welcome to Rent Manager</h1>
                    <p className="text-lg text-gray-700 mb-8">
                        Manage your rental properties with ease and efficiency.
                    </p>
                  <a
                    href="/properties"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    View Properties
                  </a>
              </div>
          </div>
      </section>
  );
};

export default Hero;