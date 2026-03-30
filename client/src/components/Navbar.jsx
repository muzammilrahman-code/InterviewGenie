import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, Bot, ArrowRight, Loader2 } from 'lucide-react';
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // isLoaded tells us if Clerk has finished checking the auth state
  const { user, isLoaded, isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
   // { name: 'Questions', href: '/questions' },
    { name: 'Upgrade', href: '/upgrade' },
    { name: 'How it Works?', href: '/how-it-works' },
    { name: 'About Us', href: '/about-us' },
  ];

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <Bot className="text-indigo-600" size={28} />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              InterviewGenie
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-600 font-medium hover:text-indigo-600 transition-all duration-300"
              >
                {link.name}
              </Link>
            ))}

            {/* Auth Logic - Prevents Flickering */}
            {!isLoaded ? (
              <div className="w-10 h-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={20} />
              </div>
            ) : isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <button 
                onClick={() => openSignIn()}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-all active:scale-95"
              >
                Get Started <ArrowRight size={18} />
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4">
             {isLoaded && isSignedIn && <UserButton />}
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-3 shadow-xl">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href} 
              className="block text-gray-700 font-medium py-2 px-3 hover:bg-indigo-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {!isSignedIn && isLoaded && (
             <button 
             onClick={() => openSignIn()}
             className="w-full bg-indigo-600 text-white py-2 rounded-lg"
           >
             Get Started
           </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;