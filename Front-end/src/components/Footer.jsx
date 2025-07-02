export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white p-4  w-full">
        <div className="container mx-auto flex justify-between items-center">
          <div>&copy; 2025 Event Management System. All rights reserved.</div>
          <div className="space-x-4">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
          </div>
        </div>
      </footer>
    );
  }