"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                P
              </div>
              <span className="font-bold text-lg">PrintVerse</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your one-stop destination for custom printing and design. Create
              stunning products with our advanced 2D and 3D design tools.
            </p>
            <div className="flex space-x-4">
              <Link href="#">
                <Button variant="outline" size="icon">
                  <Facebook className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#">
                <Button variant="outline" size="icon">
                  <Twitter className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#">
                <Button variant="outline" size="icon">
                  <Instagram className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/design"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                2D Designer
              </Link>
              <Link
                href="/customizer3d"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                3D Customizer
              </Link>
              <Link
                href="/products"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Products
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold">Services</h3>
            <div className="space-y-2">
              <Link
                href="/design"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Custom T-Shirts
              </Link>
              <Link
                href="/customizer3d"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                3D Product Design
              </Link>
              <Link
                href="/products"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Bulk Orders
              </Link>
              <Link
                href="/admin"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Business Solutions
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@printverse.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Design Street, Creative City</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} PrintVerse. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for creators</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
