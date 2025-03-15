
import { Link } from "react-router-dom";
import { ArrowLeft, Github, Globe, Twitter } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-oriby-light">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">About</h1>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-oriby-primary flex items-center justify-center mb-4">
                <span className="text-white text-3xl font-bold">OB</span>
              </div>
              <CardTitle className="text-2xl">Oriby Bookmarks</CardTitle>
              <CardDescription>Version 1.0.2</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-gray-600">
                A simple, elegant bookmark manager that helps you organize and access your favorite websites quickly.
              </p>
              
              <div className="py-2">
                <h3 className="font-medium text-gray-800 mb-1">Features</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>Quick access to all your bookmarks</li>
                  <li>Automatic favicon detection</li>
                  <li>Organize bookmarks by categories</li>
                  <li>Import and export capabilities</li>
                  <li>Fully responsive design for all devices</li>
                </ul>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium text-gray-800 mb-2">Developer</h3>
                <p className="text-oriby-primary font-medium">Sultan</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Globe size={16} />
                Website
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Twitter size={16} />
                Twitter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Github size={16} />
                GitHub
              </Button>
            </CardFooter>
          </Card>
          
          <div className="text-center text-gray-500 text-sm mt-6">
            © {new Date().getFullYear()} Oriby Bookmarks. All rights reserved.
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
