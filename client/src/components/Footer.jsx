const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-lg font-semibold">
              🏫 College Competition Marking System
            </p>
            <p className="text-sm text-gray-300">
              Streamlined marking and leaderboard management
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-300 mb-1">
              Developed with ❤️ by
            </p>
            <p className="text-lg font-bold text-blue-400">
              K Rabindra Nath Senapaty
            </p>
            <p className="text-xs text-gray-400">
              © 2025 All rights reserved
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-4 pt-4 text-center">
          <p className="text-xs text-gray-400">
           Powered by Coding Design And Development Club
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;