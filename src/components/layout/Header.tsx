
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center mb-3">
            <Link to="/" className="inline-flex items-center text-primary-foreground hover:opacity-90 transition-opacity">
              <Home className="h-5 w-5 mr-2" />
              <span className="font-medium">Home</span>
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-fade-in">Student Document Generator</h1>
          <p className="text-lg opacity-90 animate-fade-up">
            Generate various documents based on student information
          </p>
        </div>
      </div>
    </header>
  );
};
